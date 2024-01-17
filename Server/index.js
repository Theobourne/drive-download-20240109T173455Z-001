const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Vendor = require('./models/vendors')
const ParentProduct = require('./models/parent_products')
const Order = require('./models/orders')

const cors = require('cors')
app.use(cors())
mongoose.connect("mongodb+srv://teomandogan:123@cluster0.dghay0o.mongodb.net/db1?retryWrites=true&w=majority")

app.get("/getVendors", (req, res) => {
    Vendor.find()
        .then(vendors => res.json(vendors))
        .catch(err => res.json(err))
});

app.get("/getParentProducts", (req, res) => {
    ParentProduct.find()
        .then(parent_products => res.json(parent_products))
        .catch(err => res.json(err))
});

app.get("/getOrders", (req, res) => {
    Order.find()
        .then(orders => res.json(orders))
        .catch(err => res.json(err))
});
/*
aggregate method that doesnt work
app.get('/getOrdersForVendorByMonth', async (req, res) => {
    try {
        const selectedVendorID = req.query.selectedVendorID;
        const selectedMonth = req.query.orderMonth;
        const selectedYear = req.query.orderYear;

        const startDate = new Date(`${selectedYear}-${selectedMonth}-02`);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);

        const pipeline = [
            {
                $match: {
                    payment_at: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },
            {
                $unwind: '$cart_item'
            },
            {
                $lookup: {
                    from: 'parentproducts',
                    localField: 'cart_item.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $match: {
                    'product.vendor': selectedVendorID
                }
            },
            {
                $group: {
                    _id: '$product.name',
                    totalQuantity: { $sum: '$cart_item.quantity' }
                }
            }
        ];

        const result = await Order.aggregate(pipeline);

        res.json({ vendorProductSales: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
*/

app.get('/getOrdersForVendorByMonth', async (req, res) => {
    const storeName = req.queryForDate.storeName;
    const selectedVendorID = req.queryForDate.selectedVendorID;
    const selectedMonth = req.queryForDate.orderMonth;
    const selectedYear = req.queryForDate.orderYear;

    // We succesfully set our dates here.
    const startDate = new Date(`${selectedYear}-${selectedMonth}-02`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const queryForDate = {
        payment_at: {
            $gte: startDate,
            $lt: endDate
        }
    };

    const queryForProductBelonging = {
        _id: {
            $oid: productId
        },
        vendor: {
            $oid: selectedVendorID
        }
    };

    Order.find(queryForDate)
        .then(orders => {
            orders.forEach(order => {
                //we loop through each order
                const cartItems = order.cart_item;

                cartItems.forEach(item => {
                    //we loop through each cart item
                    //while looping through I want to actually filter those orders with the selected vendors products and then count them.
                    const productId = item.product;
                    const quantity = item.quantity;
                    ParentProduct.find(queryForProductBelonging)
                });
            });
        })
        .catch(error => {
            console.error(error);
        });
});


app.listen(3001, () => {
    console.log("SERVER RUNS ORIGINAL")
})