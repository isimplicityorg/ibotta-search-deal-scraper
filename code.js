function getRetailer(){
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
// Create a dynamic lightbox modal
function createModal() {
    let modal = document.createElement('div');
    modal.className = 'modal';
    document.body.appendChild(modal);
    let modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modal.appendChild(modalContent);
    let messageElement = document.createElement('p');
    messageElement.textContent = 'File created and downloaded successfully! Check your downloads for offers.json file!';
    messageElement.style.fontSize = '18px';
    messageElement.style.color = 'green';
    messageElement.style.fontWeight = 'bold';
    messageElement.style.textAlign = 'center';
    modalContent.appendChild(messageElement);
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.zIndex = '1';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.position = 'absolute';
    modalContent.style.top = '50%';
    modalContent.style.left = '50%';
    modalContent.style.transform = 'translate(-50%, -50%)';
    return modal;
};
// Parse the current page and create the JSON file
async function parseCurrentPageAndCreateFile() {
    let modal = createModal();
    let allParsedOffers = await clickNextButtonAndParse();
    let jsonString = JSON.stringify(allParsedOffers, null, 2);
    let blob = new Blob([jsonString], {
        type: 'application/json'
    });
    let downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'offers.json';
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
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
        let cashBackElement = card.querySelector('.item-offer-card__text--cash-back');
        let offerNameElement = card.querySelector('.item-offer-card__text--offer-name');
        let offerDetailsElement = card.querySelector('.item-offer-card__text--subtext');
        let cashBack = cashBackElement ? cashBackElement.textContent.trim() : '';
        let offerName = offerNameElement ? offerNameElement.textContent.trim() : '';
        let offerDetails = offerDetailsElement ? offerDetailsElement.textContent.trim() : '';
        if (retailer !== "") {
  offers.push({
    cashBack,
    offerName,
    offerDetails,
    expiration: "NO EXPIRATION",
    insertDate: "DIGITAL",
    insertId: `IBOTTA-${retailer}`,
    url: "https://ibotta.com",
    categories: "Food",
    source: `IBOTTA-${retailer}`,
    couponId: Math.random().toString(36).substring(7)
  });
} else {
  offers.push({
    cashBack,
    offerName,
    offerDetails,
    expiration: "NO EXPIRATION",
    insertDate: "DIGITAL",
    insertId: "IBOTTA",
    url: "https://ibotta.com",
    categories: "Food",
    source: "IBOTTA",
    couponId: Math.random().toString(36).substring(7)
  });
}
    });
    return offers;
} // Call the parseCurrentPageAndCreateFile function to start parsing and file creation
parseCurrentPageAndCreateFile();
