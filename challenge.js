// This constant is replacing an actual system/solution to categorize products by description.
const BASIC_SALES_WHITELIST = ['book', 'chocolate', 'pills']

function outputReceipt(receiptHTML) {
  const errorMessage = document.getElementById('errorMessage')
  errorMessage.textContent = '';
  document.getElementById('errorPanel').style.display = 'none';

  const divResult = document.getElementById('divResult')
  divResult.innerHTML = receiptHTML
  divResult.style = null
}

function outputError(errorMessage) {
  const divResult = document.getElementById('divResult')
  divResult.innerHTML = ''
  divResult.style.display = 'none';

  const errorSpan = document.getElementById('errorMessage')
  errorSpan.textContent = errorMessage;
  document.getElementById('errorPanel').style = null;
}

function castProductStringToJson(productString) {
  const inputPieces = productString.split(' ')

  const quantity = inputPieces.shift()

  if (quantity.match(/[A-z]+/)?.[0]) {
    throw new Error('Please enter the amount correctly')
  }

  let productDescription = inputPieces.shift()
  if (productDescription === 'at') {
    throw new Error('Product description is out of pattern.')
  }

  let descriptionPiece = inputPieces.shift()
  while (descriptionPiece !== 'at' && inputPieces.length) {
    productDescription = `${productDescription} ${descriptionPiece}`
    descriptionPiece = inputPieces.shift()
  }

  if (inputPieces.length !== 1) {
    throw new Error('Product description is out of pattern.')
  }

  const price = inputPieces.shift()
  if (!price.match(/[0-9]+/)?.[0]) {
    throw new Error('Price must be a numeric value.')
  }

  return {
    quantity: parseInt(quantity),
    productDescription,
    price: parseFloat(price),
  }
}

function getTax(value, quantity, taxRate) {
  const tax = value * quantity / 100 * taxRate

  return Math.ceil(tax * 20) / 20
}

function verifyTax({ price, productDescription, quantity }) {
  let taxesObject = {
    finalPrice: price,
    salesTax: 0
  }

  let basicTaxExempt = false
  for (const item of BASIC_SALES_WHITELIST) {
    if (productDescription.toLowerCase().indexOf(item) !== -1) {
      basicTaxExempt = true
      break
    }
  }

  taxesObject.salesTax = basicTaxExempt ?
    taxesObject.salesTax : taxesObject.salesTax + getTax(price, quantity, 10)

  if (productDescription.includes('import')) {
    taxesObject.salesTax = taxesObject.salesTax + getTax(price, quantity, 5)
  }

  taxesObject.finalPrice = taxesObject.salesTax > 0 ?
    (taxesObject.finalPrice * quantity) + taxesObject.salesTax:
    taxesObject.finalPrice * quantity

  taxesObject.finalPrice = parseFloat(taxesObject.finalPrice.toFixed(2))

  return taxesObject
}

function getReceiptDetails(inputValue) {
  const inputLines = inputValue.split('\n')
  const resultProducts = inputLines.map((line) => castProductStringToJson(line))
  const taxedProducts = resultProducts.map((product) => verifyTax(product))

  let receiptItems = []
  let salesTaxes = 0
  let totalPrice = 0
  for (let i = 0; i < resultProducts.length; i++) {
    receiptItems.push(`${resultProducts[i].quantity} ${resultProducts[i].productDescription}: ${taxedProducts[i].finalPrice.toFixed(2)}`)
    salesTaxes = salesTaxes + taxedProducts[i].salesTax
    totalPrice = totalPrice + taxedProducts[i].finalPrice
  }

  receiptItems.push(`Sales Taxes: ${salesTaxes.toFixed(2)}`)
  receiptItems.push(`Total: ${totalPrice.toFixed(2)}`)

  return receiptItems
}

function processInput() {
  try {
    const inputValue = document.getElementById('userInput').value
    const receiptDetails = getReceiptDetails(inputValue)

    const receiptHTML = receiptDetails.reduce((receiptText, receiptItem) => {
      receiptText = `${receiptText}<span>${receiptItem}</span>`
      return receiptText
    }, '')

    outputReceipt(receiptHTML)
  } catch(err) {
    outputError(err)
  }
}
