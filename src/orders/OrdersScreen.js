import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, StatusBar, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, WEB_URL } from "@env";
import openMap from 'react-native-open-maps';
import { Linking } from "react-native";


const WaitItem = (props) => {
	const acceptOrder = async (order) => {
		let user = await AsyncStorage.getItem('user');
		user = JSON.parse(user);
		let payload = {
			orderState: "Agree",
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
				<Text style={styles.title}>Numero de compra: {props.order.item.purchaseNumber}</Text>
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
						title="Rechazar"
						onPress={() => declineOrder(props.order.item)}
						style={styles.button}
					/>
				</View>
			</View>
		</>
	)
};

const AgreeItem = (props) => {
	const exitOrder = async (order) => {
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
					console.log(response);
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
				<Text style={styles.title}>Numero de compra: {props.order.item.purchaseNumber}</Text>
				<Text style={styles.title}>{props.order.item.name} {props.order.item.lastName}</Text>
				<Text style={styles.title}>Celular: {props.order.item.clientPhone}</Text>
				<Text style={styles.title}>Direccion de recogida {props.order.item.deliveryAddress}</Text>
				<Text style={styles.title}>{props.order.item.department} - {props.order.item.neighborhood}</Text>
				<Text style={styles.title}>Conjunto: {props.order.item.residentialGroupName} - {props.order.item.houseNumberOrApartment}</Text>
				<View style={styles.fixToText}>
					<Button
						title="Entregar"
						onPress={() => exitOrder(props.order.item)}
						style={styles.button}
					/>
						<Button
						title="Ver en el mapa"
						onPress={async (event) => {
							event.preventDefault();
							openMap({ latitud: 6.253762, longitud: -75.574973, query: props.order.item.deliveryAddress, zoom: 15 });
						}}
						style={styles.button}
					/>
				</View>
			</View>
		</>
	)
};

const FinishedItem = (props) => {
	console.log(props.order.item);
	return (
		<>
			<View style={styles.item}>
				<Text style={styles.title}>Numero de compra: {props.order.item.purchaseNumber}</Text>
				<Text style={styles.title}>{props.order.item.name} {props.order.item.lastName}</Text>
				<Text style={styles.title}>Celular: {props.order.item.clientPhone}</Text>
				<Text style={styles.title}>Direccion de recogida {props.order.item.deliveryAddress}</Text>
				<Text style={styles.title}>{props.order.item.department} - {props.order.item.neighborhood}</Text>
				<Text style={styles.title}>Conjunto: {props.order.item.residentialGroupName} - {props.order.item.houseNumberOrApartment}</Text>
				<View style={styles.fixToText}>
					<Button
						title="Ver detalle de talle de la orden"
						onPress={async (event) => {
							event.preventDefault();
							Linking.openURL(`${WEB_URL}/takeOrder/${props.order.item.deliveryNumber}`);
						}}
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
				<Text style={styles.title}>Numero de compra: {props.order.item.purchaseNumber}</Text>
				<Text style={styles.title}>{props.order.item.name} {props.order.item.lastName}</Text>
				<Text style={styles.title}>Celular: {props.order.item.clientPhone}</Text>
				<Text style={styles.title}>Direccion de recogida {props.order.item.deliveryAddress}</Text>
				<Text style={styles.title}>{props.order.item.department} - {props.order.item.neighborhood}</Text>
				<Text style={styles.title}>Conjunto: {props.order.item.residentialGroupName} - {props.order.item.houseNumberOrApartment}</Text>
				<View style={[styles.fixToText]}>
					<Button
						title="Finalizar"
						onPress={async (event) => {
							event.preventDefault();
							await AsyncStorage.setItem('orderSelected', JSON.stringify(props.order.item));
							props.navigation.navigate('DeliverOrder');
						}}
						style={styles.button}
					/>
					<Button
						title="Ver en el mapa"
						onPress={async (event) => {
							event.preventDefault();
							openMap({ latitud: 6.253762, longitud: -75.574973, query: props.order.item.deliveryAddress, zoom: 15 });
						}}
						style={styles.button}
					/>
				</View>

			</View>
		</>
	)
};

const OrdersScreen = (props) => {
	const [orders, setOrders] = useState([]);
	const [ordersState, setStateOrders] = useState('wait');
	const [ordersListByState, setStateListByStateOrders] = useState([]);

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
					navigation={props.navigation}
				/>
			);
		} else if (ordersState === "wait") {
			return (
				<WaitItem
					retrieveData={retrieveData}
					order={order}
				/>
			);
		} else if (ordersState === "finished") {
			return (
				<FinishedItem
					order={order}
				/>
			);
		} else if (ordersState === "agree") {
			return (
				<AgreeItem
					retrieveData={retrieveData}
					order={order}
				/>
			);
		}
	};
	return (
		<SafeAreaView style={styles.container}>
			<View style={[styles.containerButtons, { paddingLeft: 5, flex: 1 }]}>
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
							onPress={(event) => {
								event.preventDefault();
								retrieveData();
								setStateOrders("wait");
								setStateListByStateOrders(orders.filter((order) => order.orderState === "EsperaSalida"))
							}}
							style={styles.button}
						/>
					</View>
					<View style={[styles.boxButtons]}>
						<Button
							title="Aceptadas"
							onPress={(event) => {
								event.preventDefault();
								retrieveData();
								setStateOrders("agree");
								setStateListByStateOrders(orders.filter((order) => order.orderState === "Agree"))
							}}
							style={styles.button}
						/>
					</View>
					<View style={[styles.boxButtons]}>
						<Button
							title="Salida"
							onPress={(event) => {
								event.preventDefault();
								retrieveData();
								setStateOrders("exit");
								setStateListByStateOrders(orders.filter((order) => order.orderState === "Salida"))
							}}
							style={styles.button}
						/>
					</View>
					<View style={[styles.boxButtons]}>
						<Button
							title="Finalizadas"
							onPress={(event) => {
								event.preventDefault();
								retrieveData();
								setStateOrders("finished");
								setStateListByStateOrders(orders.filter((order) => order.orderState === "Entregada"))
							}}
							style={styles.button}
						/>
					</View>

				</View>
				<View style={{ flex: 1 }}>
					<FlatList
						data={ordersListByState}
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
	pickupButtons: {
		padding: 5,
		paddingTop: 10,
		width: "100%",
		height: 50,
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
		position: 'relative',
		width: 100,
	},
});

export default OrdersScreen;