document.addEventListener('DOMContentLoaded', () => {
	mainMenu();

	colorChange();

	bestEvent();

	visualSwiper();
	newSwiper();
	bestSwiper();
	giftSwiper();
});

function mainMenu() {
	const header = document.querySelector('header');
	const mainMenu = document.querySelectorAll('#mainmenu_list > li > a');
	const subMenu = document.querySelectorAll('.submenu');
	const menuLength = subMenu.length - 1;
	const lastMenu = subMenu[menuLength].lastElementChild;
	let isShow = false;
	let isMove = false;
	let activeMenu;

	mainMenu.forEach((menu) => {
		menu.addEventListener('mouseenter', showMenu);

		menu.parentElement.addEventListener('mouseenter', () => {
			if (!isMove) {
				menuBorder(menu);
			}
		});

		menu.addEventListener('focus', () => {
			showMenu();
			menuBorder(menu);
		});
	});

	function menuBorder(menu) {
		if (activeMenu) {
			activeMenu.classList.remove('active');
		}
		activeMenu = menu.parentElement;
		activeMenu.classList.add('active');
	}

	subMenu.forEach((sub) => {
		const subLink = sub.querySelectorAll('a');

		subFocus(subLink);
	});

	function subFocus(subLink) {
		subLink.forEach((link, index, array) => {
			const focusMain = link.closest('.menu-wrap');
			const last = array.length - 1;

			link.addEventListener('focus', () => {
				focusMain.classList.add('active');
			});

			subLink[last].addEventListener('focusout', () => {
				focusMain.classList.remove('active');
			});
		});
	}

	header.addEventListener('mouseleave', hideMenu);

	lastMenu.addEventListener('focusout', hideMenu);

	function showMenu() {
		if (!isShow) {
			isShow = true;

			gsap.to(header, { clipPath: 'inset(0 0 0px 0)' });
		}
	}

	function hideMenu() {
		if (isShow && !isMove) {
			isMove = true;
			
			gsap.to(header, {
				clipPath: 'inset(0 0 280px 0)',
				onComplete: () => {
					isMove = false;
					isShow = false;
					header.style.zIndex = '';
				}
			});

			activeMenu.classList.remove('active');
		}
	}
}

function colorChange() {
	const visualWomanList = document.querySelectorAll(
		'#visual_woman .visual_list > li'
	);
	const visualManList = document.querySelectorAll(
		'#visual_man .visual_list > li'
	);
	const newWomanList = document.querySelectorAll(
		'#new_woman .product_list > li'
	);
	const newManList = document.querySelectorAll('#new_man .product_list > li');
	const bestList = document.querySelectorAll('#best_list > li');
	const giftList = document.querySelectorAll('#gift .product_list > li');

	changeList(visualWomanList);
	changeList(visualManList);
	changeList(newWomanList);
	changeList(newManList);
	changeList(bestList);
	changeList(giftList);

	function changeList(list) {
		list.forEach((item, index) => {
			changeEvent(list, item, index);
		});
	}

	function changeEvent(list, item, index) {
		const itemImg = item.querySelector('img');
		const itemColor = item.querySelectorAll('.product_color button');
		const selectColorName = item.querySelector('.color_name');
		const visualBox = item.querySelectorAll('.visual_box');

		let selectColor = itemColor[0];
		selectColor.classList.add('select');

		itemColor.forEach((color, colorIndex, array) => {
			if (list === visualWomanList || list === visualManList) {
				visualInit(0, array[0]);
				if (visualBox.length > 1) {
					visualInit(1, array[1]);
				}
				if (visualBox.length > 2) {
					visualInit(2, array[2]);
				}
			}

			color.addEventListener('click', () => {
				if (color !== selectColor) {
					colorClick(color);
					changeImg(color, index);
					visualBorder(color, colorIndex, array);
					visualImg(color);
				}
			});
		});

		function visualInit(index, color) {
			visualSet('borderColor');
			visualSet('backgroundColor');
			visualSet('boxShadow');

			function visualSet(property) {
				visualBox[index].style[property] = getComputedStyle(color)[property];
			}
		}

		function colorClick(color) {
			selectColor.classList.remove('select');
			color.classList.add('select');

			const colorName = color.textContent;
			selectColorName.innerHTML = colorName;

			selectColor = color;
		}

		function changeImg(color, index) {
			itemImg.src = `/lululemon/images/${list[0].parentElement.classList[0]}_0${index}_${color.classList[0]}.webp`;
		}

		function visualImg(color) {
			if (list === visualWomanList || list === visualManList) {
				selectColorName.classList.remove(selectColorName.classList[1]);
				selectColorName.classList.add(color.classList[1]);

				gsap.fromTo(
					itemImg,
					{ clipPath: 'circle(20%)', opacity: 0.7 },
					{
						clipPath: 'circle(100%)',
						opacity: 1,
						duration: 1,
						ease: 'power1.out'
					}
				);
			}
		}

		function visualBorder(color, index, array) {
			const nextColor = array[index + 1] || array[0];
			const subSequentColor =
				array[index + 2] || array[(index + 2) % array.length];

			if (list === visualWomanList || list === visualManList) {
				borderColor(0, color);
				borderColor(1, nextColor);
				borderColor(2, subSequentColor);

				function borderColor(index, color) {
					gsap.to(visualBox[index], {
						borderColor: getComputedStyle(color).borderColor,
						backgroundColor: getComputedStyle(color).backgroundColor,
						boxShadow: getComputedStyle(color).boxShadow
					});
				}

				gsap.from(visualBox, {
					rotation: 0,
					x: 0,
					transition: 'border-color 0.5 ease-out',
					ease: 'power1.out'
				});
			}
		}
	}
}

function bestEvent() {
	const bestTab = document.querySelectorAll('#best_tab > button');
	const bestList = document.querySelector('#best_list');
	let activeButton = bestTab[0];

	bestTab.forEach((menu, index) => {
		menu.addEventListener('click', () => {
			if (activeButton !== menu) {
				changeTab(menu);
				bestChange(index);
			}
		});
	});

	function changeTab(menu) {
		activeButton.classList.remove('active');
		menu.classList.add('active');
		activeButton = menu;
	}

	function bestChange(index) {
		axios.get(`/lululemon/ajax/best${index}.html`).then((res) => {
			bestList.innerHTML = res.data;
			bestSwiper();
			colorChange();
			bestClass(index);

			gsap.from(bestList.children, { filter: 'blur(4px)' });
		});
	}

	function bestClass(index) {
		if (index === 0) {
			bestList.classList.remove('best_man');

			const currentClass = bestList.className;

			bestList.className = `best_woman ${currentClass}`;
		} else {
			bestList.classList.remove('best_woman');

			const currentClass = bestList.className;

			bestList.className = `best_man ${currentClass}`;
		}
	}
}

function visualSwiper() {
	const visual = document.querySelector('#visual_swiper');

	const swiper = new Swiper('#visual_swiper', {
		loop: true,
		speed: 600,
		autoplay: {
			delay: 2500,
			disableOnInteraction: false
		},
		pagination: {
			el: '#visual_swiper .swiper-pagination',
			type: 'fraction'
		},
		navigation: {
			nextEl: '#visual_swiper .swiper-button-next',
			prevEl: '#visual_swiper .swiper-button-prev'
		}
	});

	visual.addEventListener('mouseenter', function () {
		swiper.autoplay.stop();
	});

	visual.addEventListener('mouseleave', function () {
		swiper.autoplay.start();
	});
}

function newSwiper() {
	const swiperBoxes = document.querySelectorAll('.newSwiper');
	swiperBoxes.forEach((element, index) => {
		element.classList.add(`newSwiper${index}`);

		new Swiper(`.newSwiper${index} .swiper`, {
			grabCursor: true,
			slidesPerView: 2,
			grid: {
				rows: 2,
				fill: 'row'
			},
			spaceBetween: 20,
			slidesPerGroup: 2,
			pagination: {
				el: `.newSwiper${index} .swiper-pagination`,
				type: 'fraction'
			},
			navigation: {
				nextEl: `.newSwiper${index} .swiper-button-next`,
				prevEl: `.newSwiper${index} .swiper-button-prev`
			},
			scrollbar: {
				el: `.newSwiper${index} .swiper-scrollbar`,
				draggable: true,
				snapOnRelease: true,
				dragSize: 'auto'
			}
		});
	});
}

function bestSwiper() {
	const swiper = new Swiper('#best_seller .swiper', {
		effect: 'coverflow',
		speed: 500,
		loop: true,
		grabCursor: true,
		centeredSlides: true,
		slidesPerView: 'auto',
		coverflowEffect: {
			rotate: 0,
			stretch: 100,
			depth: 100,
			modifier: 1,
			scale: 0.8,
			slideShadows: true
		},
		pagination: {
			el: '#best_seller .swiper-pagination',
			type: 'fraction'
		}
	});
}

function giftSwiper() {
	const swiperBoxes = document.querySelectorAll('.giftSwiper');
	swiperBoxes.forEach((element, index) => {
		element.classList.add(`giftSwiper${index}`);

		new Swiper(`.giftSwiper${index} .swiper`, {
			grabCursor: true,
			slidesPerView: 2,
			slidesPerGroup: 2,
			spaceBetween: 20,
			pagination: {
				el: `.giftSwiper${index} .swiper-pagination`,
				type: 'fraction'
			},
			navigation: {
				nextEl: `.giftSwiper${index} .swiper-button-next`,
				prevEl: `.giftSwiper${index} .swiper-button-prev`
			},
			scrollbar: {
				el: `.giftSwiper${index} .swiper-scrollbar`,
				draggable: true,
				snapOnRelease: true,
				dragSize: 'auto'
			}
		});
	});
}
