import 'package:flutter/material.dart';

class StorePage extends StatelessWidget {
  final List<Map<String, dynamic>> products = [
    {"name": "Hydrogel Eye Patches", "price": 10},
    {"name": "V-Line Mask", "price": 15},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Store")),
      body: ListView.builder(
        itemCount: products.length,
        itemBuilder: (_, i) => ListTile(
          title: Text(products[i]['name']),
          subtitle: Text("\$" + products[i]['price'].toString()),
        ),
      ),
    );
  }
}
