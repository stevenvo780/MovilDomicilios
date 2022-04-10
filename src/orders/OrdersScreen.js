import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, StatusBar, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env"

const Item = (order) => {

	const acceptOrder = async (order) => {
		let user = await AsyncStorage.getItem('user');
		user = JSON.parse(user);
		let payload = {
			company: order.company,
			deliveryNumber: order.deliveryNumber,
			purchaseNumber: order.purchaseNumber,
			email: order.email,
			name: order.name,
			lastName: order.lastName,
			documentNumber: order.documentNumber,
			typeDocument: order.typeDocument,
			clientPhone: order.clientPhone,
			deliveryAddress: order.deliveryAddress,
			city: order.city,
			neighborhood: order.neighborhood,
			residentialGroupName: order.residentialGroupName,
			houseNumberOrApartment: order.houseNumberOrApartment,
			deliveryNote: order.deliveryNote,
			deliveryPacket: order.deliveryPacket,
			orderState: "Salida",
			domiciliary: order.domiciliary,
			pickUpAddress: order.pickUpAddress,
			deliveryHour: order.deliveryHour,
			deliveryUbication: order.deliveryUbication,
			deliveryPicture: order.deliveryPicture,
			urlSheet: order.urlSheet,
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
					console.log(response);
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
				<Text style={styles.title}>{order.order.item.name} {order.order.item.lastName}</Text>
				<Text style={styles.title}>Celular: {order.order.item.clientPhone}</Text>
				<Text style={styles.title}>Direccion de recogida {order.order.item.deliveryAddress}</Text>
				<Text style={styles.title}>{order.order.item.department} - {order.order.item.neighborhood}</Text>
				<Text style={styles.title}>Conjunto: {order.order.item.residentialGroupName} - {order.order.item.houseNumberOrApartment}</Text>
				<View style={styles.fixToText}>
					<Button
						title="Aceptar"
						onPress={() => acceptOrder(order.order.item)}
						style={styles.button}
					/>
					<Button
						title="Recibido"
						onPress={() => Alert.alert('Simple Button pressed')}
						style={styles.button}
					/>
				</View>
			</View>
		</>
	)
};

const OrdersScreen = () => {
	const renderItem = (order) => {
		return (
			<Item
				order={order}
			/>
		);
	};
	const [orders, setOrders] = useState([]);
	const getOrders = (userJson) => {
		fetch(`${API_URL}/order/user/domiciliary`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${userJson.token}`,
			},
		})
			.then((response) => response.json())
			.then(response => {
				try {
					setOrders(response);
				} catch (err) {
					console.error(err);
				};
			})
			.catch(err => {
				console.error("Error login" + err);
			});
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
	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={orders}
				renderItem={renderItem}
				keyExtractor={item => item.id}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
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