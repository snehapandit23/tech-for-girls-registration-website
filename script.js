const scriptURL = 'https://script.google.com/macros/s/AKfycbwzz2LLt6G-WDv7NWJFLPxTHq1cgzKTTG4Xk4LfRPshjHvGv46KavqoUvFz35J5crYcTQ/exec';

const form = document.forms['contact-form'];
const checkbox = document.getElementById('theme-toggle-checkbox');
const body = document.body;

const whatsappBtn = document.getElementById("whatsapp-share");
const shareCount = document.getElementById("share-count");
const shareMessage = document.getElementById("share-complete-message");
const toast = document.getElementById("toast");
const fileInput = document.getElementById("screenshot-upload");
const screenshotPreview = document.getElementById("screenshot-preview");

// === Theme Setup ===
if (localStorage.getItem('theme') === 'dark') {
	body.classList.add('dark-mode');
	checkbox.checked = true;
} else {
	body.classList.add('light-mode');
}

checkbox.addEventListener('change', () => {
	if (checkbox.checked) {
		body.classList.remove('light-mode');
		body.classList.add('dark-mode');
		localStorage.setItem('theme', 'dark');
	} else {
		body.classList.remove('dark-mode');
		body.classList.add('light-mode');
		localStorage.setItem('theme', 'light');
	}
});

// === Screenshot Preview Handling ===
fileInput.addEventListener("change", () => {
	const file = fileInput.files[0];

	if (!file) return;

	if (file.type.startsWith("image/")) {
		const reader = new FileReader();
		reader.onload = function (e) {
			screenshotPreview.src = e.target.result;
			screenshotPreview.style.display = "block";
		};
		reader.readAsDataURL(file);
	} else if (file.type === "application/pdf") {
		// For PDF, just hide preview and optionally show file name
		screenshotPreview.style.display = "none";
		alert("📄 PDF uploaded successfully. (Preview not supported)");
	} else {
		screenshotPreview.style.display = "none";
		alert("⚠️ Unsupported file type. Please upload an image or PDF.");
	}
});

// === WhatsApp Share Logic ===
let shareCounter = 0;
const maxShares = 5;

whatsappBtn.addEventListener("click", () => {
	if (shareCounter >= maxShares) {
		alert("🚫 You have already shared 5 times! Limit reached.");
		return;
	}

	const shareText = encodeURIComponent("Hey! Check out this awesome registration page.");
	const shareURL = encodeURIComponent(window.location.href);
	const fullURL = `https://api.whatsapp.com/send?text=${shareText}%20${shareURL}`;

	window.open(fullURL, "_blank");

	shareCounter++;
	shareCount.innerText = `Click count: ${shareCounter}/${maxShares}`;

	if (shareCounter > 0) {
		shareMessage.innerText = "Thanks for sharing on WhatsApp! 💚";
		shareMessage.style.display = "block";
	}

	if (shareCounter === maxShares) {
		shareMessage.innerText = "✅ You've reached the sharing limit. Thanks!";
	}
});

// === Disable Form Utility ===
function disableForm() {
	Array.from(form.elements).forEach(el => el.disabled = true);
}

// === Lock Form if Already Submitted ===
if (localStorage.getItem("formSubmitted") === "true") {
	disableForm();

	toast.innerText = "🎉 Your submission has already been recorded. Thanks for being part of Tech for Girls!";
	toast.classList.add("show");
	setTimeout(() => toast.classList.remove("show"), 4000);
}

// === Submit to Google Sheets + LocalStorage Lock ===
form.addEventListener('submit', e => {
	e.preventDefault();

	if (shareCounter < maxShares) {
		alert("Please share the registration link 5 times on WhatsApp before submitting.");
		return;
	}

	fetch(scriptURL, {
		method: 'POST',
		body: new FormData(form)
	})
		.then(response => {
			localStorage.setItem("formSubmitted", "true");
			disableForm();
			form.reset();
			screenshotPreview.style.display = "none";

			toast.innerText = "🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!";
			toast.classList.add("show");
			setTimeout(() => toast.classList.remove("show"), 4000);
		})
		.catch(error => {
			alert("There was an error submitting the form.");
			console.error('Error!', error.message);
		});
});

// === Main Lottie Animation ===
lottie.loadAnimation({
	container: document.getElementById('lottie-animation'),
	renderer: 'svg',
	loop: true,
	autoplay: true,
	path: 'https://assets10.lottiefiles.com/packages/lf20_totrpclr.json'
});

// === Preloader Animation and Hide ===
window.addEventListener("load", function () {
	const preloader = document.getElementById("preloader");

	lottie.loadAnimation({
		container: document.getElementById('lottie-loader'),
		renderer: 'svg',
		loop: true,
		autoplay: true,
		path: 'https://assets10.lottiefiles.com/packages/lf20_j1adxtyb.json'
	});

	setTimeout(() => {
		preloader.classList.add("hidden");
	}, 1000);
});
