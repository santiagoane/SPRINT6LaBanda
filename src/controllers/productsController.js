// ESTO SERIA EL GESTOR DEL MODELO
//const jsonDB = require('../model/jsonDatabase');

// Maneja todos los métodos para PRODUCTO, que lo pasa como parámetro
//const productModel = jsonDB('../data/products01');

const path = require('path');
const db = require('../database/models');
const Op = db.Sequelize.Op;
// const sequelize = db.sequelize;
// const { Op } = require("sequelize");

let productController = {

    home: (req, res) => {
        console.log('entro al home del produt controller y redirijo')

        res.redirect('/')

    },

    // Función que muestra el detalle del producto, cuando hacemos click en la foto
    show: async (req, res) => {

        // Le delego al modelo la responsabilidad
        // que la busque por ID del registro seleccionado
        // es por ello que atrapo em parámetro id

        try {
            const product = await db.Product.findByPk(req.params.id,
                {
                    include: [
                        "brand", "category", "Images", "size", "color", "gender"
                    ]
                }

            );
            console.log(JSON.parse(JSON.stringify(product)))
            console.log(product.images);
            return res.render('productos/detailProduct', { product });

        }
        catch (error) {
            console.log(error);

        }
    },

    // Función que muestra el formulario de crear Productos
    // create: (req, res) => {
    //     console.log('Entre a create')
    //     res.render('productos/createProduct');
    // },
    create: (req, res) => {
        db.Category.findAll()
            .then((categories) => {
                res.render("productos/createProduct", { categories });
            })
            .catch((error) => {
                res.send(error)
            })
        db.Brand.findAll()
            .then((brands) => {
                res.render("productos/createProduct", { brands });
            })
            .catch((error) => {
                res.send(error)
            })
        db.Color.findAll()
            .then((colors) => {
                res.render("productos/createProduct", { colors });
            })
            .catch((error) => {
                res.send(error)
            })
    },
    // Función que simula el almacenamiento, en este caso en array

    store: async (req, res) => {

        db.Product.create({
            name: req.body.name,
            description: req.body.description,
            categories_id: req.body.category,
            brands_id: req.body.brand,
            colors_id: req.body.color,
            price: req.body.price,

        })
            .then((data) => {
                db.Image.create({
                    name: req.file.filename,
                    products_id: data.id
                })
                res.redirect('/products');
            }
            )
            .catch((err) => {
                res.send(err);
            })



        // console.log(req.files);
        // // Atrapa los contenidos del formulario... Ponele
        // const product = req.body;
        // // Verificar si viene un archivo, para nombrarlo.
        // product.imagen = req.file ? req.file.filename : '';
        // console.log(product.imagen);
        // console.log(product);
        // // Cuidado sólo mando el cuerpo del FORM, el Id me lo asigna el Modelo  
        // //db.Product.create(product);
        // res.redirect('/');
    },

    edit: (req, res) => { // Delego al modelo que busque el producto
        let product = productModel.find(req.params.id);

        console.log("Abri la pagina de edicion de " + product.id + " " + product.nombre_producto)
        if (product) {
            res.render('productos/editProduct', { product });
        } else {
            res.render('error404');
        }
    },

    // Función que realiza cambios en el producto seleccionado
    update: (req, res) => {
        let product = req.body;
        console.log('product');
        product.id = req.params.id;

        product.imagen = req.file ? req.file.filename : req.body.oldImagen;

        if (req.body.imagen === undefined) {
            product.imagen = product.oldImagen
        }

        console.log('.......MOSTRA LA IMAGEN.......')
        console.log(product.imagen)
        console.log(product)


        // Elimino de la estructura auxiliar, porque no existe en Json 
        delete product.oldImagen;


        // Delego la responsabilidad al modelo que actualice
        productModel.update(product);



        res.redirect('/products/' + product.id)
    },

    // Función que elimina del Array visitados ek producto seleccionado
    destroy: (req, res) => {
        console.log('entre destroy')
        productModel.delete(req.params.id);

        // Ahora se mostrará todo porque los productos los varga de un archivo
        res.redirect('/')
    },


    cart: (req, res) => {
        res.render('productos/carrito');
    },

    search: (req, res) => {
        let dataABuscar = req.query.search;
        const filteredProducts = productModel.search(dataABuscar);
        // Filtrar todos los productos por los que contengan dataABuscar en el titulo y devolver una pagina con esos productos
        res.render('productos/listProduct', {
            products: filteredProducts,
            query: dataABuscar
        });
    },

    // show1: (req, res) => {

    //     const products = productModel.all();

    //     res.render('productos/listProduct', { products });


    // }


    show1: async (req, res) => {

        // Le delego al modelo la responsabilidad
        // que la busque por ID del registro seleccionado
        // es por ello que atrapo em parámetro id

        try {
            const product = await db.Product.findAll(req.params.id,
                {
                    include: [
                        "brand", "category", "Images", "size", "color", "gender"
                    ]
                }

            );
            console.log(JSON.parse(JSON.stringify(product)))
            console.log(product)
            return res.render('productos/listProduct', { product });

        }
        catch (error) {
            console.log(error);

        }
    }
}

    module.exports = productController
