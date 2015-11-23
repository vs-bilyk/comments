$(function () {

function Comment() { 
	this.count; 

	this.$commentsItem = $('<li class="comments__item"></li>');
	this.$commentsItemWrap = $('<div class="comments__item-wrap"></div>');
	this.$commentsItemFoto = $('<img class="comments__item-foto comments__item-foto_size-foto" src="" alt="foto">');
	this.$commentsItemContent = $('<div class="comments__item-content"></div>');
	this.$commentsItemText = $('<span class="comments__item-text"></span>');
	this.$commentsItemIgnore = $('<button class="comments__item-ignore">Заблокировать</button>');

	this.getText = function() {
		this.commentText = $('.commemts__add-new-text').val();
		$('.commemts__add-new-text').val('');
	}

	this.incrementComments = function() {
		Comment.count++;
	}

	this.decrementComments = function() {
		if (Comment.count <= 0) return;
		Comment.count--;
	}
}

Comment.count = 2;

Comment.prototype.addCommentsItem = function() {
	this.getText(); 

	if (this.commentText.length == 0) return;

	this.$commentsItemText.text(this.commentText);
	this.$commentsItemContent.append(this.$commentsItemText,this.$commentsItemIgnore);
	this.$commentsItemWrap.append(this.$commentsItemFoto,this.$commentsItemContent);
	this.$commentsItem.append(this.$commentsItemWrap);
	$('.comments__list').append(this.$commentsItem);
	this.incrementComments();
	this.publish(Comment.count);
}

Comment.prototype.ignoreComment = function(that) {
	$(that).closest('.comments__item-wrap').addClass('comments__item-wrap_ignore');
	$(that).addClass('comments__item-ignore_inactive');
	this.decrementComments();
	this.publish(Comment.count);
}

function CommentLevel1() {
	Comment.apply(this, arguments);
	this.$commentsItemAnswer = $('<a class="comments__item-answer" href="#">Ответить</a>');
	this.$commentsAnswers = $('<ul class="comments__answers"></ul>');
}

CommentLevel1.prototype = Object.create(Comment.prototype);
CommentLevel1.prototype.constructor = CommentLevel1;

CommentLevel1.prototype.addCommentsItem = function() {
	Comment.prototype.addCommentsItem.apply(this, arguments);
	this.$commentsItemIgnore.before(this.$commentsItemAnswer);
	this.$commentsItem.append(this.$commentsAnswers);
}

// function CommentLevel2() {

// } 
// CommentLevel2.prototype = Object.create(Comment.prototype);
// CommentLevel2.prototype.constructor = CommentLevel2;

function CommentHeader() {

}
CommentHeader.prototype.addHeader = function() {

	if (Comment.count == 0) { 
		$('.comments__header').text('Нет комментариев');
		return;
	}
	else if (Comment.count == 1) comm = ' комментарий';
	else if (Comment.count > 1 && Comment.count < 5) comm = ' комментария';
	else comm = ' комментариев';

	$('.comments__header').text(Comment.count + comm);
}

var commentHeader = new CommentHeader();
commentHeader.addHeader();

var newComment= new CommentLevel1();
makePublisher(newComment); 
newComment.subscribe(commentHeader.addHeader);


$(document)
	.on('submit','.comments__add-new', function(event){
		event.preventDefault();
		newComment = new CommentLevel1();

		makePublisher(newComment);
		newComment.subscribe(commentHeader.addHeader);

		newComment.addCommentsItem(); 
	})
	.on('click', '.comments__item-ignore', function() {
		var that = $(this);
		newComment.ignoreComment(that);
	})
	.on('click', '.comments__item-answer', function() {
		return false;
	})

});