/*eslint-env browser */

/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == 'undefined') var MediaKeys = {};

function getSingleElementByXpath(elementLocator, documentLocator)
{
    var docElement;
    if (documentLocator) docElement = getSingleElementByXpath(documentLocator).contentDocument;
    else docElement = document;

    //console.log("looking for " + elementLocator + " on " + document.URL);
    return docElement.evaluate(elementLocator, docElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function querySelector(elementLocator, documentLocator)
{
    var docElement;
    if (documentLocator) docElement = document.querySelector(documentLocator);
    else docElement = document;

    return docElement.querySelector(elementLocator);
}

if (MediaKeys.useXpath) MediaKeys.find = getSingleElementByXpath
else MediaKeys.find = querySelector