import React, { useState } from 'react';
import {
	ImageBackground,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	Image,
	Platform,
	Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env";
import * as ImagePicker from 'expo-image-picker';
import firebase from '../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const DeliverOrderScreen = (props) => {
	const [isError, setIsError] = useState(false);
	const [note, setNote] = useState('');
	const [message, setMessage] = useState('');
	const [imgSource, setImgSource] = useState(null);
	const storage = getStorage();

	const onChangeNote = (note) => {
		setNote(note);
	}

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		if (!imgSource) {
			setMessage("Falta imagen");
			setIsError(true);
			return null;
		}
		if (note == '') {
			setMessage("Falta una nota");
			setIsError(true);
			return null;
		}
		setMessage('Guardando...');
		setIsError(false);
		const uploadUri = Platform.OS === "ios" ? imgSource.uri.replace("file://", "") : imgSource.uri;
		const storageRef = ref(storage, `images/${imgSource.name}`);
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (e) {
				console.log(e);
				reject(new TypeError("Network request failed"));
			};
			xhr.responseType = "blob";
			xhr.open("GET", uploadUri, true);
			xhr.send(null);
		});

		uploadBytesResumable(storageRef, blob)
			.then(snapshot => {
				getDownloadURL(snapshot.ref).then(async (downloadURL) => {
					let user = await AsyncStorage.getItem('user');
					let location = await AsyncStorage.getItem('location');
					let order = await AsyncStorage.getItem('orderSelected');
					let dateNow = new Date();
					user = JSON.parse(user);
					order = JSON.parse(order);
					let payload = {
						dealerNote: note,
						pickupPicture: downloadURL,
						pickupLocation: location,
						pickupTime: dateNow,
						orderState: "Entregada",
					};
					fetch(`${API_URL}/order/${order.deliveryNumber}`, {
						method: 'PATCH',
						body: JSON.stringify(payload),
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${user.token}`,
						},
					})
						.then((response) => response.json())
						.then(response => {
							console.log(response);
							setIsError(false);
							setMessage("Guardado con éxito");
						})
						.catch(err => {
							console.error("Error login" + err);
						});
				});
			}).catch(error => {
				console.log(`Failed to upload file and get link - ${error}`);
			});
	};

	const chooseFile = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.cancelled) {
			setImgSource({
				uri: result.uri,
				name: result.uri.split("/").pop()
			});
		}
	};

	return (
		<ImageBackground style={styles.image}>
			<View style={styles.card}>
				<Text style={styles.heading}>Constancia de entrega</Text>
				<View style={styles.form}>

					<View style={styles.inputs}>
						<TextInput
							style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
							placeholder="Nota"
							multiline={true}
							numberOfLines={4}
							autoCapitalize="none"
							onChangeText={onChangeNote}>
						</TextInput>

						<View style={styles.eightyWidthStyle} >
							<Button title={'Subir foto'} onPress={chooseFile}>Subir foto</Button>
						</View>
						<TouchableOpacity style={styles.buttonAlt} onPress={onSubmitHandler}>
							<Text style={styles.buttonAltText}>Guardar</Text>
						</TouchableOpacity>
						{(message !== '') && (
							<>
								<Text style={[styles.message, { color: isError ? 'red' : 'green' }]}>{message}</Text>
							</>
						)}
						{(imgSource !== null) && (
							<Image style={styles.uploadImage} source={{ uri: imgSource.uri }} />
						)}
					</View>
				</View>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	imgContainer: {
		position: 'absolute',
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
	},
	eightyWidthStyle: {
		marginTop: 20,
		width: '30%',
		height: 50,
	},
	uploadImage: {
		position: 'relative',
		bottom: -80,
		width: '80%',
		height: 300,
	},
	boldTextStyle: {
		fontWeight: 'bold',
		fontSize: 22,
		color: '#5EB0E5',
	},
	image: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
	},
	card: {
		flex: 1,
		backgroundColor: 'rgba(255, 255, 255, 0.4)',
		width: '100%',
		marginTop: '5%',
		borderRadius: 20,
		maxHeight: 380,
		paddingBottom: '30%',
	},
	heading: {
		fontSize: 30,
		fontWeight: 'bold',
		marginLeft: '10%',
		marginTop: '5%',
		marginBottom: '5%',
		color: 'black',
	},
	form: {
		marginTop: '50%',
		flex: 1,
		justifyContent: 'space-between',
	},
	inputs: {
		width: '100%',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: '10%',
	},
	input: {
		width: '80%',
		borderBottomWidth: 1,
		borderBottomColor: 'black',
		paddingTop: 10,
		fontSize: 16,
		minHeight: 40,
	},
	button: {
		width: '80%',
		backgroundColor: 'black',
		height: 40,
		borderRadius: 50,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 5,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '400'
	},
	buttonAlt: {
		width: '80%',
		borderWidth: 1,
		height: 40,
		borderRadius: 50,
		borderColor: 'black',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 5,
	},
	buttonAltText: {
		color: 'black',
		fontSize: 16,
		fontWeight: '400',
	},
	message: {
		fontSize: 16,
		height: 20,
		marginTop: '3%',
	},
});

export default DeliverOrderScreen;