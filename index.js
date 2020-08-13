const axios = require('axios')

const FIXER_API_KEY = '419662709b93b1ce9b5cd0c2d7ff0004'
const FIXER_API = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`

const RES_COUNTRIES_API = 'https://restcountries.eu/rest/v2/currency'

// Async/Await

// Fetch data about currencies
const getExchangeRate = async (fromCurrency, toCurrency) => {
	try {
		const {
			data: { rates },
		} = await axios.get(FIXER_API)

		const euro = 1 / rates[fromCurrency] // Base

		const exchangeRate = euro * rates[toCurrency]

		return exchangeRate
	} catch (error) {
		throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}.`)
	}
}

// Fetch data about RES_COUNTRIES_API
const getCountries = async (currencyCode) => {
	try {
		const { data } = await axios.get(`${RES_COUNTRIES_API}/${currencyCode}`)

		return data.map(({ name }) => name)
	} catch (error) {
		throw new Error(`Unable to get countries that use ${currencyCode}.`)
	}
}

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
	fromCurrency = fromCurrency.toUpperCase()
	toCurrency = toCurrency.toUpperCase()

	const [exchangeRate, countries] = await Promise.all([
		getExchangeRate(fromCurrency, toCurrency),
		getCountries(toCurrency),
	])

	const convertedAmount = (amount * exchangeRate).toFixed(2)

	return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. 
	You can spend these in the following countries: ${countries}.`
}

convertCurrency('USD', 'PHP', 20)
	.then((result) => console.log(result))
	.catch((err) => console.log(err))

// ?  Node v.14.3 can use TOP LEVEL AWAIT :
// ? const result = await convertCurrency('USD', 'PHP', 20)
// ? console.log(result)
