import React, { useState } from 'react';
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env"

const AuthScreen = (props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState('');
	const [isLogin, setIsLogin] = useState(true);

	const onSubmitHandler = () => {
		const payload = {
			email,
			password,
		};
		fetch(`${API_URL}/auth`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})
			.then(async (res) => {
				const jsonRes = await res.json();
				if (jsonRes.token) {
					try {
						await AsyncStorage.setItem(
							'user',
							JSON.stringify(jsonRes)
						);
						props.navigation.navigate('Orders')
					} catch (error) {
						console.log("error al guardar" + error);
					}
					setIsError(false);
					setIsLogin(!isLogin);
					setMessage('');
				} else {
					setIsError(true);
					setMessage('Error en los datos');
				}
			})
			.catch(err => {
				console.log("Error login" + err);
				setMessage('Error en los datos');
				setIsError(true);
			});
	};


	return (
		<ImageBackground style={styles.image}>
			<View style={styles.card}>
				<Text style={styles.heading}>Login</Text>
				<View style={styles.form}>
					<View style={styles.inputs}>
						<TextInput style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={setEmail}></TextInput>
						<TextInput secureTextEntry={true} style={styles.input} placeholder="Password" onChangeText={setPassword}></TextInput>
						<Text style={[styles.message, { color: isError ? 'red' : 'green' }]}>{message}</Text>
						<TouchableOpacity style={styles.buttonAlt} onPress={onSubmitHandler}>
							<Text style={styles.buttonAltText}>Log In</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	image: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
	},
	card: {
		flex: 1,
		backgroundColor: 'rgba(255, 255, 255, 0.4)',
		width: '80%',
		marginTop: '40%',
		borderRadius: 20,
		maxHeight: 380,
		paddingBottom: '30%',
	},
	heading: {
		fontSize: 30,
		fontWeight: 'bold',
		marginLeft: '10%',
		marginTop: '5%',
		marginBottom: '30%',
		color: 'black',
	},
	form: {
		flex: 1,
		justifyContent: 'space-between',
		paddingBottom: '5%',
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
		height: 40,
		marginVertical: '5%',
	},
});

export default AuthScreen;