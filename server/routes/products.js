const router = require("express").Router();
const { product } = require("../models/product");
const axios = require("axios");
router.get("/fetch_products", async (req, res) => {
	try {
		const d = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
		console.log(5);
		await product.insertMany(d.data); // store the data into the database

	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


//api for statistics
router.get("/statistics", async (req, res) => {
	try {
		let month = req.query.month;
		let number = req.query.number;

		const selectedMonth = parseInt(month);

		if (number == 1) {
			const totalSaleAmount = await product.aggregate([
				{
					$addFields: {
						saleMonth: { $month: { $toDate: '$dateOfSale' } }
					}
				},
				{
					$match: {
						saleMonth: selectedMonth,
						sold: true
					}
				}, { $group: { _id: null, sum_val: { $sum: "$price" } } }])


			res.status(200).json(totalSaleAmount.length > 0 ? totalSaleAmount[0].sum_val : 0);
		}

		else if (number == 2) {


			const soldItems = await product.find({
				sold: true,
				$expr: {
					$eq: [{ $month: { $toDate: '$dateOfSale' } }, selectedMonth]
				}
			});

			// Count the number of sold items
			res.status(200).json(soldItems.length);
		}


		else if (number == 3) {

			const notsoldItems = await product.find({
				sold: false,
				$expr: {
					$eq: [{ $month: { $toDate: '$dateOfSale' } }, selectedMonth]
				}
			});

			res.status(200).json(notsoldItems.length);
		}

	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


//for bar chart
router.get('/bar-chart', async (req, res) => {
	try {
		let month = req.query.month;

		// Extract the month value from the provided month
		const selectedMonth = parseInt(month);

		// Calculate the price range for each item
		const priceRanges = await product.aggregate([
			{
				$addFields: {
					priceRange: {
						$switch: {
							branches: [
								{ case: { $lte: ["$price", 100] }, then: "0 - 100" },
								{ case: { $lte: ["$price", 200] }, then: "101 - 200" },
								{ case: { $lte: ["$price", 300] }, then: "201 - 300" },
								{ case: { $lte: ["$price", 400] }, then: "301 - 400" },
								{ case: { $lte: ["$price", 500] }, then: "401 - 500" },
								{ case: { $lte: ["$price", 600] }, then: "501 - 600" },
								{ case: { $lte: ["$price", 700] }, then: "601 - 700" },
								{ case: { $lte: ["$price", 800] }, then: "701 - 800" },
								{ case: { $lte: ["$price", 900] }, then: "801 - 900" },
							],
							default: "901-above"
						}
					}
				}
			},
			{
				$match: {
					$expr: {
						$eq: [{ $month: { $toDate: '$dateOfSale' } }, selectedMonth]
					}
				}
			},
			{
				$group: {
					_id: "$priceRange",
					count: { $sum: 1 }
				}
			},
			{
				$sort: { _id: 1 } // Sort by price range
			}
		]);

		res.status(200).json(priceRanges);
	} catch (error) {
		console.error('Error generating bar chart data:', error);
		res.status(500).json({ error: 'Failed to generate bar chart data' });
	}
});

// for pie chart
router.get('/pie-chart', async (req, res) => {
	try {
		let month = req.query.month;

		// Extract the month value from the provided month
		const selectedMonth = parseInt(month);

		// Calculate the number of items for each category
		const categoryItems = await product.aggregate([
			{
				$match: {
					$expr: {
						$eq: [{ $month: { $toDate: '$dateOfSale' } }, selectedMonth]
					}
				}
			},
			{
				$group: {
					_id: '$category',
					count: { $sum: 1 }
				}
			}
		]);

		res.status(200).json(categoryItems);
	} catch (error) {
		console.error('Error generating pie chart data:', error);
		res.status(500).json({ error: 'Failed to generate pie chart data' });
	}
});


// combination of 3 APIs
async function fetchDataFromAPIs() {
	try {
		const pieChartAPI = 'http://localhost:8080/products/bar-chart?month=2';
		const barChartAPI = 'http://localhost:8080/products/pie-chart?month=2';
		const statisticsAPI1 = 'http://localhost:8080/products/statistics?month=2&number=1';
		const statisticsAPI2 = 'http://localhost:8080/products/statistics?month=2&number=2';
		const statisticsAPI3 = 'http://localhost:8080/products/statistics?month=2&number=3';
		const pieChartData = await axios.get(pieChartAPI);
		const barChartData = await axios.get(barChartAPI);
		const statisticsData1 = await axios.get(statisticsAPI1);
		const statisticsData2 = await axios.get(statisticsAPI2);
		const statisticsData3 = await axios.get(statisticsAPI3);
		return { pieChartData: pieChartData.data, barChartData: barChartData.data, statisticsData1: statisticsData1.data, statisticsData2: statisticsData2.data, statisticsData3: statisticsData3.data };
	} catch (error) {
		console.error('Error fetching data from APIs:', error);

	}
}



router.get("/combination", async (req, res) => {
	try {
		const combinedData = await fetchDataFromAPIs();
		res.status(200).json(combinedData);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch and combine data from APIs' });
	}
})
module.exports = router;
