function getRetailer() {
  // Find the retailer name
  let element = document.querySelector('.inline-flex.-mt-1.text-4xl.font-extrabold');
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
  
  let allParsedOffers = await clickNextButtonAndParse();
  //create and download the file
  createJSONFile(allParsedOffers, fileName)
  //create the modal popup in the DOM
  let modal = createModal(message);
  //show modal
  modal.style.display = 'block';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 5000);
  // Change the timeout duration as needed
}
async function clickNextButtonAndParse() {
  let nextButton = document.querySelector('a[aria-label="Next Page"]');
  if (nextButton && nextButton.getAttribute('aria-label') !== 'Next Page, already on last page') {
    let currentPageOffers = await parseCurrentPage();
    nextButton.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    let nextPageOffers = await clickNextButtonAndParse();
    let allOffers = currentPageOffers.concat(nextPageOffers);
    return allOffers;
  } else {
    return parseCurrentPage();
  }
}
async function parseCurrentPage() {
  let cards = document.querySelectorAll('.item-offer-card');
  let offers = [];
  let retailer = getRetailer().toUpperCase();

  cards.forEach((card) => {
    let currentUrl = window.location.href;
    let cashBackElement = card.querySelector('.item-offer-card__text--cash-back');
    let offerNameElement = card.querySelector('.item-offer-card__text--offer-name');
    let offerDetailsElement = card.querySelector('.item-offer-card__text--subtext');
    let strCouponValue = cashBackElement ? cashBackElement.textContent.trim() : '';
    let strName = offerNameElement ? offerNameElement.textContent.trim() : '';
    let strDescription = offerDetailsElement ? offerDetailsElement.textContent.trim() : '';
    if (retailer !== "") {
      offers.push({
        "name": strName + strDescription,
        "couponValue": strCouponValue,
        "expirationDate": "No Expiration",
        "description": strDescription,
        "dateOfInsert": "DIGITAL",
        "insertId": `IBOTTA-${retailer}`,
        "couponUrl": currentUrl,
        "categories": "Food",
        "dataSource": `IBOTTA-${retailer}`,
        "couponId": createCouponId("cc-")
      });
    } else {
      offers.push({
        "name": strName + strDescription,
        "couponValue": strCouponValue,
        "expirationDate": "No Expiration",
        "description": strDescription,
        "dateOfInsert": "DIGITAL",
        "insertId": `IBOTTA-${retailer}`,
        "couponUrl": currentUrl,
        "categories": "Food",
        "dataSource": "IBOTTA",
        "couponId": createCouponId("cc-")
      });
    }
  });
  return offers;
} // Call the parseCurrentPageAndCreateFile function to start parsing and file creation
parseCurrentPageAndCreateFile("ibotta-offers.json");



