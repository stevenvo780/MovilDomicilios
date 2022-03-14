import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, StatusBar, AsyncStorage, Button } from 'react-native';

const API_URL = "http://192.168.1.16:3006/api";

const DATA = [
	{
		id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
		title: 'First Item',
	},
	{
		id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
		title: 'Second Item',
	},
	{
		id: '58694a0f-3da1-471f-bd96-145571e29d72',
		title: 'Third Item',
	},
];

const Item = (order) => {
	const accept = (order) => {
		order.orderStatus = "Salida";
		fetch(`${API_URL}/order/${order.deliveryNumber}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${user.token}`,
			},
			body: JSON.stringify(order),
		})
			.then(res => {
				try {
					const jsonRes = res.json();
					console.log(jsonRes);
				} catch (err) {
					console.error(err);
				};
			})
			.catch(err => {
				console.error("Error login" + err);
			});
	}
	const rejected = (order) => {
		order.domiciliary = "";
		fetch(`${API_URL}/order/${order.deliveryNumber}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${user.token}`,
			},
		})
			.then(res => {
				try {
					const jsonRes = res.json();
					console.log(jsonRes);
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
						style={styles.button}
						onPress={() =>
							accept(order)
						}
					/>
					<Button
						title="Recibido"
						style={styles.button}
						onPress={() =>
							rejected(order)
						}
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
	const [user, setUser] = useState();
	const getOrders = (userJson) => {
		fetch(`${API_URL}/order/user/domiciliary`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${userJson.token}`,
			},
		})
			.then(res => {
				try {
					const jsonRes = res.json();
					setOrders(jsonRes);
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
				setUser(user);
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