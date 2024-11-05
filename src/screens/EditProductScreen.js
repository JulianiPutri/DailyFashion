import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import ImagePicker from 'react-native-image-crop-picker'
import { InputComponent } from '../components/InputComponent'
import SelectDropdown from 'react-native-select-dropdown'
import {categoryList} from '../../data/Data';
import realm from '../../store/realm'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen-hooks';


const EditProductScreen = (props) => {
    const {route, navigation} = props;
    const idProduct = route.params.idProduct;
    const [productData, setProductData] = useState({
        productName: '',
        imagePath: '',
        category: null,
        description: '',
        price: null,
        instagram: '',
        facebook: '',
        phoneNumber: ''
    })

    const onInputChange = (type,value) => {
        setProductData({
            ...productData,
            [type]:value
        })
    }

    const addImage = () =>{
        ImagePicker.openPicker({
          width: 2000,
          height: 2000,
          cropping: true
        }).then(image => {
          console.log(image)
          setProductData({
            ...productData,
            imagePath: image.path
          });
        }).catch(errorMassage => {
          console.log(errorMassage);
        })
    }

    const saveData = () => {
        if (productData.productName === '' || productData.imagePath === '' || productData.description === '' || productData.price === '' || productData.category === ''){
          alert('Please fill all your product information!');
        }else if(productData.phoneNumber === '' && productData.instagram === '' && productData.facebook === ''){
          alert('Please fill at least one seller contact!');
        }else{
            const updateData = realm.objects('Product').filtered(`id =${idProduct}`)[0];
           if(
              updateData.productName === productData.productName && 
              updateData.imagePath === productData.imagePath &&
              updateData.category === productData.category &&
              updateData.description === productData.description &&
              updateData.price === parseInt(productData.price) &&
              updateData.instagram === productData.instagram &&
              updateData.facebook === productData.facebook &&
              updateData.phoneNumber === productData.phoneNumber
            ){
              alert("Nothing to update!");
            }else{
              realm.write(()=>{
                  updateData.productName = productData.productName;
                  updateData.imagePath = productData.imagePath;
                  updateData.category = productData.category;
                  updateData.description = productData.description;
                  updateData.price = parseInt(productData.price);
                  updateData.instagram = productData.instagram;
                  updateData.facebook = productData.facebook;
                  updateData.phoneNumber = productData.phoneNumber;
              });
              Alert.alert(
                  "Success",
                  "Succesfully update your product information",
                  [{
                      text:"OK", onPress: () => navigation.goBack()
                  }]
              )
            }
          }
    }

    useEffect(()=>{
        const data = realm.objects('Product').filtered(`id = ${idProduct}`)[0];
        setProductData({
            productName: data.productName,
            imagePath: data.imagePath,
            category: data.category,
            description: data.description,
            price: String(data.price),
            instagram: data.instagram,
            facebook: data.facebook,
            phoneNumber: data.phoneNumber
        })
    },[])
    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.imageContainer}>
                <TouchableOpacity
                style={styles.imageButton}
                onPress={()=>addImage()}
                >
                <Image
                    style={{
                    width: productData.imagePath!== ''?200 : 50, 
                    height:productData.imagePath!== ''?200 : 50}}
                    source={{
                    uri: productData.imagePath !==''?
                    productData.imagePath
                    :
                    'https://static.thenounproject.com/png/187803-200.png'
                    }}
                />
                </TouchableOpacity>
            </View>
            <View style={styles.horizontalContainer}>
                <InputComponent
                  placeholder='Product Name'
                  value={productData.productName}
                  onChangeText={(text)=>onInputChange('productName', text)}
                />
                <SelectDropdown
                    data={categoryList}
                    defaultButtonText='Select category'
                    onSelect={(item)=>{
                        onInputChange('category',item.id)
                    }}
                    buttonTextAfterSelection={(item)=>{
                        return item.name
                    }}
                    rowTextForSelection={(item)=>{
                        return item.name
                    }}
                    buttonStyle={styles.selectDropdown}
                    buttonTextStyle={styles.selectText}
                    defaultValueByIndex={productData.category-1}
                />
            </View>
            <View style={styles.horizontalContainer}>
              <InputComponent
                placeholder='Description'
                value={productData.description}
                onChangeText={(text)=>onInputChange('description', text)}
                isDescription={true}
              />
              <InputComponent
                  placeholder='Price'
                  value={productData.price}
                  onChangeText={(text)=>onInputChange('price', text)}
                  isIcon={true}
                  name="dollar"
                  type="font-awesome"
                  keyboardType= 'numeric'
              />
            </View>
            <Text style={styles.sellerText}>Seller Contact</Text>
            <InputComponent
                placeholder='Whastapp number (ex : +4498739230)'
                value={productData.phoneNumber}
                onChangeText={(text)=>onInputChange('phoneNumber', text)}
                isIcon={true}
                name="whatsapp"
                type="font-awesome"
                keyboardType="phone-pad"
            />
            <InputComponent
                placeholder='Instagram username (ex : timedooracademy)'
                value={productData.instagram}
                onChangeText={(text)=>onInputChange('instagram', text)}
                isIcon={true}
                name="instagram"
                type="font-awesome"
            />
            <InputComponent
                placeholder='Facebook username (ex : timedooracademy)'
                value={productData.facebook}
                onChangeText={(text)=>onInputChange('facebook', text)}
                isIcon={true}
                name="facebook"
                type="font-awesome"
            />
            <View style={styles.buttonContainer}>
                    <TouchableOpacity
                    style={styles.saveButton}
                    onPress={()=>saveData()}
                    >
                    <Text style={styles.saveText}>EDIT</Text>
                    </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: 'white'
    },
    scroll: {
      margin: 8,
      paddingBottom: 8
    },
    imageContainer: {
      alignItems: 'center',
      marginVertical: 8  
    },
    imageButton: {
      width: 200,
      height: 200,
      borderWidth: 0.5,
      justifyContent: 'center',
      alignItems: 'center'
    },
    horizontalContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    sellerText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 16,
      marginLeft: 8,
      marginBottom: 0,
      color: 'black'
    },
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8
    },
    saveButton: {
      marginTop: 16,
      borderWidth: 1,
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: 'mistyrose'
    },
    saveText: {
      color: 'black'
    },
    selectDropdown: {
      borderRadius: 10,
      backgroundColor: 'skyblue',
      width: 150,
      height: 30,
      marginLeft: 8
    },
    selectText: {
      fontSize: 12
    }
});

export default EditProductScreen