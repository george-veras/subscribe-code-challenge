const expect = chai.expect

describe('Challenge JavaScript file', () => {
  describe('castProductStringToJson(productString)', () => {
    it('should cast a correct product string into a json object', () => {
      const result = castProductStringToJson('1 imported box of chocolates at 10.00')
      expect(result).to.deep.equal({
        quantity: 1,
        productDescription: 'imported box of chocolates',
        price: 10.00
      })
    })

    it('should throw an error if the amount is NOT numeric.', () => {
      const wrongStringParameter = () => castProductStringToJson('1ow t-shirt at 15.00')

      expect(wrongStringParameter).to.throw('Please enter the amount correctly')
    })

    it('should throw an error if the word "at" is right after the amount.', () => {
      const wrongStringParameter = () => castProductStringToJson('1 t-shirt 15.00')

      expect(wrongStringParameter).to.throw('Product description is out of pattern.')
    })

    it('should throw an error if the word "at" is NOT present.', () => {
      const wrongStringParameter = () => castProductStringToJson('1 t-shirt 15.00')

      expect(wrongStringParameter).to.throw('Product description is out of pattern.')
    })
  })

  describe('verifyTax(productObject)', () => {
    describe('should return a json object with the correct applicable taxes', () => {
      it('should apply 5% tax rate on imported goods', () => {
        const result = verifyTax({
          quantity: 1,
          productDescription: 'imported box of chocolates',
          price: 100.00
        })
        expect(result).to.deep.equal({
          finalPrice: 105.00,
          salesTax: 5.00
        })
      })

      it('should apply 10% tax rate on products exempt from books, food and medical products', () => {
        const result = verifyTax({
          quantity: 1,
          productDescription: 'music CD',
          price: 100.00
        })
        expect(result).to.deep.equal({
          finalPrice: 110.00,
          salesTax: 10.00
        })
      })
    })
  })

  describe('Challenge original tests', () => {
    describe('Testing Input #1', () => {
      it('should return Output #1', () => {
        const receipt = getReceiptDetails('2 book at 12.49\n1 music CD at 14.99\n1 chocolate bar at 0.85')
        expect(receipt).to.deep.equal([
          "2 book: 24.98",
          "1 music CD: 16.49",
          "1 chocolate bar: 0.85",
          "Sales Taxes: 1.50",
          "Total: 42.32",
        ])
      })
    })

    describe('Testing Input #2', () => {
      it('should return Output #2', () => {
        const receipt = getReceiptDetails('1 imported box of chocolates at 10.00\n1 imported bottle of perfume at 47.50')
        expect(receipt).to.deep.equal([
          "1 imported box of chocolates: 10.50",
          "1 imported bottle of perfume: 54.65",
          "Sales Taxes: 7.65",
          "Total: 65.15",
        ])
      })
    })

    describe('Testing Input #3', () => {
      it('should return Output #3', () => {
        const receipt = getReceiptDetails('1 imported bottle of perfume at 27.99\n1 bottle of perfume at 18.99\n1 packet of headache pills at 9.75\n3 imported boxes of chocolate at 11.25')
        expect(receipt).to.deep.equal([
          "1 imported bottle of perfume: 32.19",
          "1 bottle of perfume: 20.89",
          "1 packet of headache pills: 9.75",
          "3 imported boxes of chocolate: 35.45",
          "Sales Taxes: 7.80",
          "Total: 98.28",
        ])
      })
    })
  })
})
