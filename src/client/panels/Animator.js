'use strict';

const Panel = require('../prototypes/Panel.js'),
			{imageSmoothingDisabled, make} = require('../utils.js'),
			{ CHANGE_SPRITE, DELETE_FRAME } = require('../constants').events,
			{ SNAP, FLOAT, B, L, R, TL, TR, BL, BR} = require('../constants').panels,
			{ TRANSPARENT_IMG } = require('../constants'),
			Animator = new Panel('Animator', SNAP, undefined, 230, 40, TR);
let time = 0.5 * 1000, loop, index = 0, ctx;


Animator.mainInit = function () {
	this.background = make(['canvas', {className : 'background'}]).getContext('2d');
	this.preview = make(['canvas', {className : 'preview'}]).getContext('2d');

	this.contentPreview = make(['div',
		{parent : this.el, className : 'content-preview'},
		this.background.canvas,
		this.preview.canvas
	]);

	// this.preview = document.createElement('canvas').getContext('2d');
	// this.background = document.createElement('canvas').getContext('2d');
	//
	// this.background.canvas.classList.add('background');
	// this.preview.canvas.classList.add('preview');
	//
	// this.contentPreview = document.createElement('div');
	// this.contentPreview.classList.add('content-preview');
	//
	// this.contentPreview.appendChild(this.background.canvas);
	// this.contentPreview.appendChild(this.preview.canvas);
	// this.el.appendChild(this.contentPreview);

	Editor.events.on(CHANGE_SPRITE + '.' + this.name, this.changeSprite, this);
	Editor.events.on(DELETE_FRAME + '.' + this.name, this.changeFrame, this);

	$(this.preview.canvas).on('click.animator', this.changeStatus.bind(this));
};
Animator.paintBackground = function () {
	let pattern = this.background.createPattern(TRANSPARENT_IMG, "repeat");
	this.background.rect(0, 0, this.background.canvas.width, this.background.canvas.height);
	this.background.fillStyle = pattern;
	this.background.fill();
};
Animator.changeFrame = function (type) {
	index = 0;
};
Animator.changeSprite = function (sprite) {
	this.scale;
	if (sprite.width > sprite.height) {
		this.scale = this.contentPreview.clientWidth / sprite.width;
	}else {
		this.scale = this.contentPreview.clientWidth / sprite.height;
	}
	this.background.canvas.width = this.preview.canvas.width =	sprite.width * this.scale;
	this.background.canvas.height = this.preview.canvas.height =	sprite.height * this.scale;
	this.background.canvas.style.marginTop = this.preview.canvas.style.marginTop = ((this.contentPreview.clientWidth - this.preview.canvas.height) / 2) + 'px';
	this.background.canvas.style.marginLeft = this.preview.canvas.style.marginLeft = ((this.contentPreview.clientWidth - this.preview.canvas.width) / 2) + 'px';
	this.start();
	this.paintBackground();
};
Animator.start = function () {
	if (this.started) {
		return;
	}
	this.started = true;
	loop = setInterval(function () {
		Animator.loop();
	}, time);
};
Animator.changeStatus = function () {
	console.log(this.started);
	if (this.started) {
		this.stop();
	}else {
		this.start();
	}
};
Animator.stop = function () {
	this.started = false;
	clearInterval(loop);
};
Animator.loop = function () {
	if (index == Editor.sprite.frames.length - 1) {
		index = -1;
	}
	index++;
	this.clean();
	imageSmoothingDisabled(this.preview);
	this.preview.drawImage(Editor.sprite.frames[index].getIMG(), 0, 0, this.preview.canvas.width, this.preview.canvas.height);
};
Animator.clean = function () {
	this.preview.canvas.height = this.preview.canvas.height;
};
module.exports = () => Editor.addPanel(Animator);