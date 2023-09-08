// Create a dynamic lightbox modal
const createModal = () => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    document.body.appendChild(modal);
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modal.appendChild(modalContent);
    const messageElement = document.createElement('p');
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
    const modal = createModal();
    const allParsedOffers = await clickNextButtonAndParse();
    const jsonString = JSON.stringify(allParsedOffers, null, 2);
    const blob = new Blob([jsonString], {
        type: 'application/json'
    });
    const downloadLink = document.createElement('a');
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
    const nextButton = document.querySelector('a[aria-label="Next Page"]');
    if (nextButton && nextButton.getAttribute('aria-label') !== 'Next Page, already on last page') {
        const currentPageOffers = await parseCurrentPage();
        nextButton.click();
        await new Promise((resolve) => setTimeout(resolve, 100));
        const nextPageOffers = await clickNextButtonAndParse();
        const allOffers = currentPageOffers.concat(nextPageOffers);
        return allOffers;
    } else {
        return parseCurrentPage();
    }
}
async function parseCurrentPage() {
    const cards = document.querySelectorAll('.item-offer-card');
    const offers = [];
    cards.forEach((card) => {
        const cashBackElement = card.querySelector('.item-offer-card__text--cash-back');
        const offerNameElement = card.querySelector('.item-offer-card__text--offer-name');
        const offerDetailsElement = card.querySelector('.item-offer-card__text--subtext');
        const cashBack = cashBackElement ? cashBackElement.textContent.trim() : '';
        const offerName = offerNameElement ? offerNameElement.textContent.trim() : '';
        const offerDetails = offerDetailsElement ? offerDetailsElement.textContent.trim() : '';
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
    });
    return offers;
} // Call the parseCurrentPageAndCreateFile function to start parsing and file creation
parseCurrentPageAndCreateFile();
