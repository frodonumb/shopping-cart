const express = require('express');
const cors = require('cors');
const authRouter = require('./route/authRouter');
const productRouter = require('./route/productRouter');
const cartRouter = require('./route/cartRouter');
const accessSecurity = require('./auth-util/access-security');

const app = express();
const checkSession = accessSecurity.checkSession;


app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8081;



app.use('/auth', authRouter);
app.use(express.static('res'));
app.use('/images', express.static('images'));

app.use('/products', checkSession, productRouter);
app.use('/shopping-cart', checkSession, cartRouter);
app.use('/', function(req, res){
    res.json({message: 'Updated'});
})
app.use((req, res) => {
    res.status(404).send();
});


app.listen(port, () => {
    console.log(`Application is Running on ${port}`);
});