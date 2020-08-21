var objectQuagga = {initQuagga: () => {console.log("init ");}};
var app = new Vue({
    el: "#app",
    data: {
        products: JSON.parse(localStorage.getItem("products")) || [],
        warnings: [],
        warningsEdit: [],
        RegisterProveedores: JSON.parse(localStorage.getItem("proveedores")) || [],
        ListaProveedores: ["Salmi", "Capistrano", "Lala", "Bimbo"],
        ProveedorName: "vacio", 
        CodigoBarrasName: "",
        ProductoName: "",
        UnidadName: "",
        CantidadName: "",
        tableProducts: 0,
        dataEdit: {codigo: "", name: "", unidad: "", cantidad: ""},
        productSelect: "",
        proveedorActual: localStorage.getItem("proveedor") || "",
        otroProveedor: false,
        editPrducto: 0,
        lectorVisible: false,
        scannerActivo: false,
        textButtonScanner: "Scanner",
        proveedorSelect: ""
    },
    mounted: function() {
        this.$refs.addRegister.addEventListener('click', this.handleRegister);
        this.$refs.cleanCamps.addEventListener('click', this.handleClean);
    },
    methods: {
        openRegister: function(proveedor) {
            this.ProveedorName = proveedor;
            this.proveedorActual = proveedor;
            localStorage.setItem("proveedor", proveedor);
            this.forceUpdate();
        },
        deleteRegisterOfProveedor: function(proveedor) {
            const newArrayProducts = this.products.filter((product) => product.proveedor != proveedor);
            this.setProductsInLocalStorage(newArrayProducts);
            const newArrayProveedores = this.RegisterProveedores.filter((element) => element != proveedor);
            this.setProveedoresInLocalStorage(newArrayProveedores);
            if (proveedor === this.proveedorActual || this.RegisterProveedores.length === 0) {
                this.proveedorActual = "";
                this.ProveedorName = "vacio";
                localStorage.setItem("proveedor", "");
            }
        },
        setSelectProveedor: function(proveedor) {
            this.proveedorSelect = proveedor;
        },
        existRegisterOfProveedor: function(proveedor) {
            const proveedorFinded = this.RegisterProveedores.find((elemento) => proveedor.toLowerCase() == elemento.toLowerCase());
            if (typeof proveedorFinded === "undefined") return false;
            return true;
        },
        newRegister: function() {
            this.cleanCell();
            this.proveedorActual = "";
            this.ProveedorName = "vacio";
        },
        activateLector: function () {
            this.lectorVisible = true;
            if (this.textButtonScanner === "Detener") {
                Quagga.stop();
                this.scannerActivo = false;
                this.textButtonScanner = "Scanner";
            }
        },
        activateScanner: function () {
            objectQuagga.initQuagga();
            this.scannerActivo = true;
            this.textButtonScanner = "Detener";
        },
        forceUpdate: function() { this.tableProducts += 1; },
        handleRegister: function() {
            this.validaDatos();
            if ((this.warnings).length === 0 && this.proveedorActual.trim().length === 0 ) {
                if (this.existRegisterOfProveedor(this.ProveedorName)) {
                    this.warnings.push("Este proveedor ya esta registrado");
                    return;
                }
                this.RegisterProveedores.push(this.ProveedorName);
                this.setProveedoresInLocalStorage(this.RegisterProveedores);
            }
            if ((this.warnings).length === 0) {
                this.addProduct(this.CodigoBarrasName, this.ProductoName, this.UnidadName, this.CantidadName);
                this.cleanCell();
                this.forceUpdate();
            }
        },
        addProduct: function(codigo, name, unidad, cantidad) {
            if (this.proveedorActual.trim().length === 0) {
                this.proveedorActual = this.ProveedorName;
                localStorage.setItem("proveedor", this.ProveedorName);
            }
            (this.products).push({codigo, name, unidad, cantidad, proveedor: this.proveedorActual});
            this.setProductsInLocalStorage(this.products);
        },
        setRegisterSelect: function({...register}) {
            this.setProductSelect(register.codigo);
            this.dataEdit = register;
        },
        updateProduct: function() {
            this.validaDatosEdit();
            if ((this.warningsEdit).length === 0) {
                const arrayProducts = this.products.map((element) => {
                    const elementToReturn = (element.codigo === this.productSelect) ? this.dataEdit : element;
                    return elementToReturn;
                });
                this.setProductsInLocalStorage(arrayProducts);
                this.$refs.cancelEdit.click();
            }
        },
        setProductSelect: function(product) {
            this.productSelect = product;
        },
        removeProducto: function() {
            if (this.products.length <= 1) {
                this.removeAllRegister();
                this.editPrducto += 1;
            } else {
                const arrayProducts = this.products.filter((element) => element.codigo !== this.productSelect);
                this.setProductsInLocalStorage(arrayProducts);
            }
        },
        handleClean: function() {
            this.cleanCell();
            this.ProveedorName = localStorage.getItem("proveedor") || "vacio";
        },
        cleanCell: function() {
            this.warnings = [];
            this.CodigoBarrasName ="";
            this.ProductoName ="";
            this.UnidadNam = "";
            this.CantidadName = "";
            this.lectorVisible = false;
        },
        validaDatos: function() {
            this.warnings = [];
            if ((this.ProveedorName).trim() === "" || (this.ProveedorName).trim() === "vacio") (this.warnings).push("Falta seleccionar un Proveedor");
            if ((this.CodigoBarrasName).trim() === "") (this.warnings).push("Falta ingresar codigo de barras");
            if ((this.ProductoName).trim() === "") (this.warnings).push("Falta ingresar producto");
            if ((this.UnidadName).trim() === "") (this.warnings).push("Falta seleccionar unidad");
            if ((this.CantidadName).trim() === "") (this.warnings).push("Falta ingresar cantidad");
            
            if ((this.warnings).length > 0) return true;

            if(!(/^[0-9]+$/g.test(this.CodigoBarrasName))) (this.warnings).push("Codigo de barras debe ser numero");
            if(!(/^([0-9]+.*[0-9]+)$|^([0-9]+)$/g.test(this.CantidadName))) (this.warnings).push("Cantidad debe ser numero");
        },
        validaDatosEdit: function() {
            this.warningsEdit = [];
            if ((this.dataEdit.codigo).trim() === "") (this.warningsEdit).push("Falta ingresar codigo de barras");
            if ((this.dataEdit.name).trim() === "") (this.warningsEdit).push("Falta ingresar producto");
            if ((this.dataEdit.unidad).trim() === "") (this.warningsEdit).push("Falta seleccionar unidad");
            if ((this.dataEdit.cantidad).trim() === "") (this.warningsEdit).push("Falta ingresar cantidad");
            
            if ((this.warningsEdit).length > 0) return true;

            if(!(/^[0-9]+$/g.test(this.dataEdit.codigo))) (this.warningsEdit).push("Codigo de barras debe ser numero");
            if(!(/^([0-9]+.*[0-9]+)$|^([0-9]+)$/g.test(this.dataEdit.cantidad))) (this.warningsEdit).push("Cantidad debe ser numero");
        },
        removeAllRegister: function() {
            this.products = [];
            this.proveedorActual = "";
            this.ProveedorName = "vacio";
            this.otroProveedor = false;
            this.RegisterProveedores = [];
            localStorage.clear();
        },
        verifyProveedorSelected: function() {
            this.otroProveedor = (this.ProveedorName === "");
        },
        bakcToSelect: function() {
            this.ProveedorName = "vacio";
            this.otroProveedor = false;
        },
        createFile: function() {
            var hoy = new Date();
            let nameProvedores = "";
            var CsvString = `\r\n ,Fecha,${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}\r\n`;
            this.RegisterProveedores.forEach(register => {
                nameProvedores += `_${register}`;
                CsvString += `\r\n ,Proveedor,${register}\r\n\r\n`;
                CsvString += " ,Codigo de barras,Producto,Unidad,Cantidad\r\n"
                this.products.map( product => {
                    CsvString += ` ,${product.codigo},${product.name},${product.unidad},${product.cantidad}\r\n\r\n`;
                });
            });
            CsvString = "data:application/csv," + encodeURIComponent(CsvString);
            var x = document.createElement("A");
            x.setAttribute("href", CsvString );
            x.setAttribute("download",`Registro Mercancia ${nameProvedores}_ - ${hoy.getDate()}_${hoy.getMonth() + 1}_${hoy.getFullYear()} T${hoy.getHours()}${hoy.getMinutes()}.csv`);
            document.body.appendChild(x);
            x.click();
        },
        setProductsInLocalStorage: function(newArrayProducts) {
            this.products = newArrayProducts;
            const stringJson = JSON.stringify(this.products);
            localStorage.setItem("products", stringJson);
        },
        setProveedoresInLocalStorage: function(newArrayProveedore) {
            this.RegisterProveedores = newArrayProveedore;
            const stringJson = JSON.stringify(this.RegisterProveedores);
            console.log("proveedores", stringJson);
            localStorage.setItem("proveedores", stringJson);
        }
    }
});
