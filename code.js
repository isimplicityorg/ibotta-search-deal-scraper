function getRetailer() {
  // Find the retailer name
  var element = document.querySelector('.inline-flex.-mt-1.text-4xl.font-extrabold');
  retailer = "";
  // Check if the element exists
  if (element) {
    // Get the text content of the element
    retailer = element.textContent.trim();
  } else {
    retailer = "";
  }
  return retailer
}
// Parse the current page and create the JSON file
async function parseCurrentPageAndCreateFile(fileName) {
  var message="File created and downloaded successfully! Check your downloads for " + fileName + " file!";
  
  var allParsedOffers = await clickNextButtonAndParse();
  //create and download the file
  createJSONFile(allParsedOffers, fileName)
  //create the modal popup in the DOM
  var modal = createModal(message);
  //show modal
  modal.style.display = 'block';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 5000);
  // Change the timeout duration as needed
}
async function clickNextButtonAndParse() {
  var nextButton = document.querySelector('a[aria-label="Next Page"]');
  if (nextButton && nextButton.getAttribute('aria-label') !== 'Next Page, already on last page') {
    var currentPageOffers = await parseCurrentPage();
    nextButton.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    var nextPageOffers = await clickNextButtonAndParse();
    var allOffers = currentPageOffers.concat(nextPageOffers);
    return allOffers;
  } else {
    return parseCurrentPage();
  }
}
async function parseCurrentPage() {
  var cards = document.querySelectorAll('.item-offer-card');
  var offers = [];
  var retailer = getRetailer().toUpperCase();
var retailerText = "";
  cards.forEach((card) => {
    //we are no longer using the current deal url. 
    //we use our affiliate link instead
    //If there is a way to do both we will do that in the future.
    var currentUrl = "https://tinyurl.com/3tsvwmns";
    var cashBackElement = card.querySelector('.item-offer-card__text--cash-back');
    var offerNameElement = card.querySelector('.item-offer-card__text--offer-name');
    var offerDetailsElement = card.querySelector('.item-offer-card__text--subtext');
    var strCouponValue = cashBackElement ? cashBackElement.textContent.trim() : '';
    var strName = offerNameElement ? offerNameElement.textContent.trim() : '';
    var strDescription = offerDetailsElement ? offerDetailsElement.textContent.trim() : '';

    if (retailer !== "") {
      retailerText = `IBOTTA-${retailer}`;
    } else {
      retailerText = "IBOTTA";
    }

    var items = [
      strName + " " + strDescription,
      strCouponValue,
      "No Expiration",
      strDescription,
      "DIGITAL",
      retailerText,
      currentUrl,
      "Food",
      retailerText,
      createCouponId("cc-")
    ];
    offers.push(createDatabaseJson(items));
  });
  return offers;
} // Call the parseCurrentPageAndCreateFile function to start parsing and file creation
parseCurrentPageAndCreateFile("ibotta-offers.json");



