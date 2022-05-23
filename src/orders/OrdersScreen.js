import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, StatusBar, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env"

const WaitItem = (props) => {
	const acceptOrder = async (order) => {
		let user = await AsyncStorage.getItem('user');
		user = JSON.parse(user);
		let payload = {
			orderState: "Salida",
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
				try {
					props.retrieveData();
				} catch (err) {
					console.error(err);
				};
			})
			.catch(err => {
				console.error("Error login" + err);
			});
	}
	const declineOrder = async (order) => {
		let user = await AsyncStorage.getItem('user');
		user = JSON.parse(user);
		let payload = {
			domiciliary: "0",
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
				try {
					props.retrieveData();
				} catch (err) {
					console.error(err);
				};
			})
			.catch(err => {
				console.error("Error login" + err);
			});
	}
	return (
		<>
			<View style={styles.item}>
				<Text style={styles.title}>{props.order.item.name} {props.order.item.lastName}</Text>
				<Text style={styles.title}>Celular: {props.order.item.clientPhone}</Text>
				<Text style={styles.title}>Direccion de recogida {props.order.item.deliveryAddress}</Text>
				<Text style={styles.title}>{props.order.item.department} - {props.order.item.neighborhood}</Text>
				<Text style={styles.title}>Conjunto: {props.order.item.residentialGroupName} - {props.order.item.houseNumberOrApartment}</Text>
				<View style={styles.fixToText}>
					<Button
						title="Aceptar"
						onPress={() => acceptOrder(props.order.item)}
						style={styles.button}
					/>
					<Button
						title="Recibido"
						onPress={() => declineOrder(props.order.item)}
						style={styles.button}
					/>
				</View>
			</View>
		</>
	)
};

const ExitItem = (props) => {
	return (
		<>
			<View style={styles.item}>
				<Text style={styles.title}>{props.order.item.name} {props.order.item.lastName}</Text>
				<Text style={styles.title}>Celular: {props.order.item.clientPhone}</Text>
				<Text style={styles.title}>Direccion de recogida {props.order.item.deliveryAddress}</Text>
				<Text style={styles.title}>{props.order.item.department} - {props.order.item.neighborhood}</Text>
				<Text style={styles.title}>Conjunto: {props.order.item.residentialGroupName} - {props.order.item.houseNumberOrApartment}</Text>
			</View>
		</>
	)
};

const OrdersScreen = () => {
	const [orders, setOrders] = useState([]);
	const [ordersState, setStateOrders] = useState('wait');

	const getOrders = async (userJson) => {
		const ordersResponse = await fetch(`${API_URL}/order/user/domiciliary`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${userJson.token}`,
			},
		})
			.then((response) => response.json());
		if (ordersResponse) {
			setOrders(ordersResponse);
		}
	}

	const retrieveData = async () => {
		try {
			let user = await AsyncStorage.getItem('user');
			user = JSON.parse(user);
			if (user !== null) {
				getOrders(user);
			}
		} catch (error) {
			console.error(error)
		}
	};
	useEffect(() => {
		retrieveData();
	}, []);
	const renderItem = (order) => {
		if (ordersState === "exit") {
			return (
				<ExitItem
					order={order}
				/>
			);
		} else {
			return (
				<WaitItem
					retrieveData={retrieveData}
					order={order}
				/>
			);
		}
	};
	return (
		<SafeAreaView style={styles.container}>
			<View style={[styles.containerButtons, { paddingLeft: 10, flex: 1 }]}>
				<View style={[styles.boxButtons]}>
					<Button
						title="Actualizar"
						onPress={(event) => { event.preventDefault(); retrieveData(); setStateOrders(ordersState) }}
						style={styles.button}
					/>
				</View>
				<View style={[styles.row]}>
					<View style={[styles.boxButtons]}>
						<Button
							title="Espera"
							onPress={(event) => { event.preventDefault(); setStateOrders("wait") }}
							style={styles.button}
						/>
					</View>
					<View style={[styles.boxButtons]}>
						<Button
							title="Salida"
							onPress={(event) => { event.preventDefault(); setStateOrders("exit") }}
							style={styles.button}
						/>
					</View>
				</View>
				<View style={{ flex: 1 }}>
					<FlatList
						data={
							ordersState === "exit"
								? orders.filter(order => order.orderState === "Salida")
								: orders.filter(order => order.orderState === "EsperaSalida")}
						renderItem={renderItem}
						keyExtractor={item => item.id}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	containerButtons: {
		flex: 1,

		alignItems: 'center',
		justifyContent: 'center',
	},
	row: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	boxButtons: {
		padding: 5,
		width: "50%",
		height: 50,
	},
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0,
	},
	fixToText: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	item: {
		backgroundColor: '#c9c9c9',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	title: {
		fontSize: 14,
	},
	description: {
		fontSize: 32,
	},
	button: {
		width: 100,
	},
});

export default OrdersScreen;