//requerimos la libreria mongoose
const mongoose=require('mongoose');
//definimos el esquema de datos para nuestra coleccion de fincas
const fincaSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    altura:{
        type:Number,
        required:true
    },
    direccion:{
        type:String,
        required:true
    }
    },{
        timestamps:true,
        versionKey:false
    }
    )
    //definimos el modelo de finca
    const FincaModel=mongoose.model('fincas',fincaSchema)
    //exportamos el modelo
    module.exports=FincaModel