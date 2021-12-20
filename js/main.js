document.addEventListener('mousedown', function (event) {

	let dragElement = event.target.closest('.draggable');

	if (!dragElement) return;

	// УБРАТЬ ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ (*8)
	event.preventDefault();

	document.ondragstart = function () {
		return false;
	}

	let shiftX, shiftY;

	// ЗАПУСК РАБОТЫ ВСЕГО СКРИПТА (*17)
	startDragging(dragElement, event.clientX, event.clientY)

	// ДЛЯ ТОГО, ЧТОБЫ ЗАПУСТИТЬ ФУНКЦИЮ onMove() НЕ ПРОСТО С clientX/Y, А ИМЕННО event.clientX/Y. ПРОИСХОДИТ РАССЧЕТ АКТУАЛЬНЫХ ДЛЯ КАЖДОГО ДВИЖЕНИЯ МЫШИ ЗНАЧЕНИЙ
	function onMouseMove(event) {
		onMove(event.clientX, event.clientY);
	}

	function startDragging(element, clientX, clientY) {
		shiftX = clientX - element.getBoundingClientRect().left;
		shiftY = clientY - element.getBoundingClientRect().top;

		// ОПРЕДЕЛЕНИЕ МЕТРИК ЛЕГЧЕ ДЕЛАТЬ ПРИ ФИКСИРОВАННОЙ ПОЗИЦИИ ЭЛЕМЕНТА
		element.style.position = 'fixed';

		// ЧТОБЫ ПРИ НАЖАТИИ НА ЭЛЕМЕНТ ОН ПРИНИМАЛ НЕ ФИКСИРОВАННОЕ ИЗНАЧАЛЬНОЕ ПОЛОЖЕНИЕ, А СРАЗУ АКТУАЛЬНОЕ
		onMove(event.clientX, event.clientY);

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', finishDrag);
	}

	function onMove(clientX, clientY) {
		let newX = clientX - shiftX;
		let newY = clientY - shiftY;

		// ОПРЕДЕЛЕНИЕ ГИПОТЕТИЧЕСОГО НИЖНЕГО КРАЯ ОКНА
		let newBottom = newY + dragElement.offsetHeight;

		// НЕ ДАЁМ ВЫЙТИ ЗА ПРЕДЕЛЫ ОКНА, ДЕЛАЕМ ВЕРТИКАЛЬНУЮ ПРОКРУТКУ (*46-60)
		if (newBottom > document.documentElement.clientHeight) {
			scrollBy(0, 15);
			newY = document.documentElement.clientHeight - dragElement.offsetHeight;
		}

		if (newY < 0) {
			scrollBy(0, -15);
			newY = 0;
		}

		if (newX < 0) newX = 0;

		if (newX > document.documentElement.clientWidth - dragElement.offsetWidth) {
			newX = document.documentElement.clientWidth - dragElement.offsetWidth;
		}

		dragElement.style.top = newY + 'px'
		dragElement.style.left = newX + 'px'
	}

	function finishDrag() {

		// ЗАДАЁМ ЗНАЧЕНИЕ top ЭЛЕМЕНТА УЖЕ НЕ ОТНОСИТЕЛЬНО ОКНА, О ОТНОСИТЕЛЬНО ВСЕГО ДОКУМЕНТА, ЧТОБЫ АБСОЛЮТНОЕ ПОЗИЦИОНИРОВАНИЕ РАБОТАЛО ПРАВИЛЬНО
		dragElement.style.top = dragElement.getBoundingClientRect().top + window.pageYOffset + 'px'
		dragElement.style.position = 'absolute'

		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', finishDrag);
	}
})