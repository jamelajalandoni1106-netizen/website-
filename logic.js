/* ========================================
   COMBINED JAVASCRIPT FILE
   All JS files merged into one (excluding ItemInventory.js)
   ======================================== */

/* ========================================
   MAIN LOGIC (logic.js)
   ======================================== */

var sidebarButton = document.getElementById('sidebarButton');
var sidebar = document.getElementById('sidebar');
var mainTag = document.getElementById('main');
var searchBar = document.getElementById('searchBar')
var searchResult = document.getElementById('search-result')

const emptyStar = "<i class='bx bx-star'></i>"
const fillStar = "<i class='bx bxs-star'></i>"
const halfStar = "<i class='bx bxs-star-half'></i>"

// with this the "main" html tag will now listen to mouse clicks
mainTag.addEventListener("click", onClickFunction, true);

function ToggleSidebar() {
	sidebar.classList.toggle("show");
}

function onClickFunction() {
	// This will only be true if the sidebar is open
	if(sidebar.classList.contains('show')) {
		ToggleSidebar(); // Close the sidebar
	}
}

// This code is for showing or hiding the "GoUp" button
document.addEventListener('scroll', () => {
    const scrollElement = document.querySelector('.goUp');
    const scrollAmount = window.scrollY || document.documentElement.scrollTop;
    const triggerHeight = 600; // Change this value to the scroll amount you want

    if (scrollAmount > triggerHeight) {
        scrollElement.classList.add("showGoUp");
    } else {
        scrollElement.classList.remove("showGoUp");
    }
});

// Use this function/Method to make the scroll go to the very top
function goUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideSearchResult() {
    searchResult.classList.add('hideSearch')
}

function updateSearchResults() {
    // Check if the Search InputField is empty
    if(searchBar.value.length === 0) {
        searchResult.classList.add('hideSearch')
        return
    }
    // If it's not empty show the searchResult <div>
    else {
        searchResult.classList.remove('hideSearch')
    }

    // Empty the searchResult first, and prepare variables
    searchResult.innerHTML = ""
    let counter = 0
    let found = 0

    // Check each item in the Pseudo-Database
    inventory.items.forEach(item => {
        // Only stop the loop when we reached the 6th item
        if(counter > 5) {
            return
        }

        // Check if the current item contains some words from the inputField and increment the "found" counter by 1
        if(item["item name"].toLowerCase().includes(searchBar.value.toLowerCase())) {
            searchResult.innerHTML += `<p>`+ item["item name"] +`</p>`
            found++
        }
        counter++
    })

    // If the search result doesn't found atleast 1 item, then hide the searchResult <div>
    if(found === 0) {
        searchResult.classList.add('hideSearch')
    }
}

// A function for displaying a product that is available in the inventory
// ItemIDs is an array of integers that will be put in the ParentElement
// ParentEleID is an Element where the product will be put as a child
function displayProduct(itemIDs, parentEle) {
    inventory.items.forEach(item => {
        
        // Only append the item if it is requested in the array
        if (itemIDs.includes(item["item id"])) {
    
            parentEle.innerHTML += `
            <a href="ProductViewer.html?productID=`+ item["item id"] +`" style="text-decoration: none; color: #25252F;">
            <div class="item">
            `+
                (item.discount == 0 ? " " : "<p class='discount'>-"+item.discount+"%</p>")
            +`
            <img src="`+ item["image path"] +`">
            <div class="details">
                <h3>`+ item["item name"] +`</h3> 
                <p style="font-size: 14px;">`+ item["item type"] +`</p>
                <br>
                `+
                    (item.discount == 0 ? "<p>₱"+ item.price +"</p>" 
                        :"<p><span>₱"+calculateDiscountPrice(item.price, item.discount)+"</span> <span class='slash'>₱"+item.price+"</span></p>")
                +`
                <i class='bx bxs-plus-circle'></i>
            </div>
            <div class="star-container">
                `+
                getStars(item.reviews)
                +`
                <p style="font-size:12px">(`+ item.reviews.length +`)</p>
            </div>  
            </div>
            </a>
            ` 
        }
    });
}

function getStars(arr) {
    let stringBuilder = ""
    let totalStars = 0
    let count = arr.length

    for(let i = 0; i < count; i++) {
        totalStars += arr[i]["star rating"]
    }

    const averageRating = totalStars / count
    const roundedAverage = Math.round(averageRating * 2) / 2

    // Generate stars and add it in the stringBuilder
    for (let i = 0; i < 5; i++) {
        if (i + 0.5 == roundedAverage) {
            stringBuilder += halfStar;
        } else if (i < roundedAverage) {
            stringBuilder += fillStar;
        } else {
            stringBuilder += emptyStar;
        }
    }

    return stringBuilder
}

function percentToDecimal(percentage) {
    return percentage / 100
}

function calculateDiscountPrice(price, discountPercent) {
    return price - (price * percentToDecimal(discountPercent))
}

/* ========================================
   BANNER LOGIC (Banner.js)
   ======================================== */

var slideIndex = 4;

// Constantly change banner by 3 sec
slides(1);
const interval2 = setInterval(() => {
  slides(1);
}, 5000);

function slides(n) {
    showSlides(slideIndex += n);
}

function currentSlides(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("slide1");
    var dots = document.getElementsByClassName("dot");
    if(n> slides.length) {slideIndex = 1 }
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++){
        slides[i].classList.remove("active");
    }
    for (i=0;i < dots.length;i++){
        dots[i].innerHTML = "<i class='bx bx-radio-circle'></i>";
    }
    slides[slideIndex-1].classList.add("active");
    dots[slideIndex - 1].innerHTML = "<i class='bx bx-radio-circle-marked'></i>";
}

/* ========================================
   PRODUCT VIEW LOGIC (PViewLogic.js)
   ======================================== */

const urlQuery = window.location.search
const urlParams = new URLSearchParams(urlQuery)
const productID = urlParams.get("productID")

let product = undefined
inventory.items.forEach(item => {
	if(item["item id"] == productID) {
		product = item
		return
	}
})

let productImage        = document.getElementById("product-image")
let productType         = document.getElementById("product-type")
let productName         = document.getElementById("product-name")
let productPrice        = document.getElementById("product-price")
let productDiscount     = document.getElementById("product-discount")
let productDescription  = document.getElementById("product-description")
let productDetails      = document.getElementById("product-details")
let productStar         = document.getElementById("product-star-container")

productImage.style.backgroundImage = `url("`+ product["image path"]  +`")`
productType.innerHTML           = product["item type"]
productName.innerHTML           = product["item name"]
productPrice.innerHTML          = "₱" + calculateDiscountPrice(product.price, product.discount) + ` <span id="product-discount-price" style="color: #d2d2d2;"></span>`

let productDiscountPrice = document.getElementById("product-discount-price")
productDiscountPrice.innerHTML  = "₱" + product.price

productDiscount.innerHTML       = "-" +product.discount+ "%"
productDiscount.style.display   = (product.discount == 0) ? "none" : "block"
productDiscountPrice.style.display = (product.discount == 0) ? "none" : "inline"
productDiscountPrice.style.textDecoration = (product.discount == 0) ? "none" : "line-through"

productStar.innerHTML = getStars(product.reviews)
productStar.innerHTML += `<p style="font-size:12px">`+ product.reviews.length +` Reviews</p>`

productDescription.innerHTML = product.description
productDetails.innerHTML = product.details

let reviewHolder = document.getElementById('review-holder')
product.reviews.forEach(review => {
    reviewHolder.innerHTML += 
    `
    <div class="review">
        <div class="review-header">
            <i class='bx bxs-user-circle' style="font-size:40px;"></i>
            <div>
                <div style="display: flex; align-items: center;">
                <p><b>`+ review.author +`</b></p>
                <p style="font-size:12px; color: gray; margin-top: 2px; margin-left: 10px;">9/28/2024</p>
                </div>
                <div class="star-container">
                    `+
                    getRawStars(review)
                    +`
                </div>  
            </div>
        </div>
        <p style="margin-left: 45px;">
        `+
        review.message
        +`
        </p>
    </div>
    `
})

function getRawStars(cr) {
    let stringBuilder = ""

    // Generate stars and add it in the stringBuilder
    for (let i = 0; i < 5; i++) {
        if (i + 0.5 == cr["star rating"]) {
            stringBuilder += halfStar;
        } else if (i < cr["star rating"]) {
            stringBuilder += fillStar;
        } else {
            stringBuilder += emptyStar;
        }
    }
    return stringBuilder
}

function goBack() {
    window.history.back()
}

/* ========================================
   ADD TO CART LOGIC (addtocart.js)
   ======================================== */

var sidebarButton1 = document.getElementById('sidebarButton1');
var cartTab = document.getElementById('cartTab');
var mainTag2 = document.getElementById('main');

let list = document.querySelector('.list');
let listCart = document.querySelector('.listCart');
let body = document.querySelector('body');
let checkout = document.querySelector('.checkout');
let quantity = document.querySelector('.quantity');

mainTag2.addEventListener("click", onClickFunction1, true); 

function ToggleSidebar1() {
	cartTab.classList.toggle("show");
}

function onClickFunction1() {
	// This will only be true if the sidebar is open
	if(cartTab.classList.contains('show')) {
		ToggleSidebar1(); // Close the sidebar
	}
}
