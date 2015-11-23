
var publisher = {

	subscribers: { // список подписчиков
		any: []  
	},

	subscribe: function (fn, type) {  // метод для подписки 
		type = type || 'any'; 

		if (typeof this.subscribers[type] === 'undefined') {  
			this.subscribers[type] = [];  
		}
		this.subscribers[type].push(fn);  
	},

	unsubscribe: function (fn, type) { // метод для отписки 
		this.visitSubscribers('unsubscribe', fn, type);
	},

	publish: function (publication, type) { // метод который реализует публикацию переданных издателем данных
		this.visitSubscribers('publish', publication, type); 
	},

	visitSubscribers: function (action, arg, type) { 
		var pubtype = type || 'any',  
		subscribers = this.subscribers[pubtype],
		max = subscribers.length;  

		for (var i = 0; i < max; i++) {
			if (action === 'publish') {
				subscribers[i](arg);
			}  
			else if (subscribers[i] === arg) {
				subscribers.splice(i, 1);
			}
		}
	}
};

function makePublisher(o) { // функция-конструктор для создания объекта издателя, принимает объект

	for (var i in publisher) {
		if (publisher.hasOwnProperty(i) && typeof publisher[i] === 'function') {	
			o[i] = publisher[i];
		}
	}
	o.subscribers = {any: []};
}

