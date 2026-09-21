import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'cord_cico_biz_test_data';

type Product = {
  id: string;
  name: string;
  unit: string;
  stock: number;
  price: number;
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState(0);
  const [expense, setExpense] = useState(0);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setProducts(d.products || []);
        setSales(d.sales || 0);
        setExpense(d.expense || 0);
      }
    })();
  }, []);

  async function save(
    p = products,
    s = sales,
    e = expense
  ) {
    setProducts(p);
    setSales(s);
    setExpense(e);
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify({ products: p, sales: s, expense: e })
    );
  }

  function addProduct() {
    if (!name.trim() || !qty.trim()) {
      return Alert.alert(
        'Missing information',
        'Enter a product name and opening stock.'
      );
    }

    const p = [
      ...products,
      {
        id: Date.now().toString(),
        name: name.trim(),
        unit: 'pieces',
        stock: Number(qty) || 0,
        price: 0,
      },
    ];

    setName('');
    setQty('');
    save(p);
  }

  function sell(i: number) {
    const p = [...products];

    if (p[i].stock <= 0) {
      return Alert.alert(
        'Stock warning',
        'This product is out of stock.'
      );
    }

    p[i].stock -= 1;
    save(p, sales + p[i].price);
  }

  const stockCount = products.reduce(
    (a, p) => a + p.stock,
    0
  );

  return (
    <ScrollView
      style={s.page}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={s.logo}>CORD CICO BIZ</Text>
      <Text style={s.sub}>
        Business management test version
      </Text>

      <View style={s.grid}>
        <Card
          title="Today's Sales"
          value={`₦${sales.toLocaleString()}`}
        />
        <Card
          title="Expenses"
          value={`₦${expense.toLocaleString()}`}
        />
        <Card
          title="Net Balance"
          value={`₦${(sales - expense).toLocaleString()}`}
        />
        <Card
          title="Stock Units"
          value={String(stockCount)}
        />
      </View>

      <Text style={s.h}>Quick Stock Test</Text>

      <View style={s.box}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Product name"
          style={s.input}
        />

        <TextInput
          value={qty}
          onChangeText={setQty}
          placeholder="Opening stock"
          keyboardType="numeric"
          style={s.input}
        />

        <Pressable
          style={s.button}
          onPress={addProduct}
        >
          <Text style={s.buttonText}>ADD PRODUCT</Text>
        </Pressable>
      </View>

      <Text style={s.h}>Products</Text>

      {products.length === 0 ? (
        <Text style={s.muted}>
          No products yet. Add one above.
        </Text>
      ) : (
        products.map((p, i) => (
          <View key={p.id} style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{p.name}</Text>
              <Text style={s.muted}>
                Stock: {p.stock} {p.unit}
              </Text>
            </View>

            <Pressable
              style={s.small}
              onPress={() => sell(i)}
            >
              <Text>SELL 1</Text>
            </Pressable>
          </View>
        ))
      )}

      <Text style={s.h}>Modules to test</Text>

      {[
        'Purchases',
        'Sales & Expenditure',
        'Stock',
        'Credit Sales',
        'Receipt',
        'Sync & Backup',
        'Account',
      ].map((x) => (
        <View key={x} style={s.module}>
          <Text style={s.moduleText}>{x}</Text>
          <Text style={s.muted}>
            Development module
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <View style={s.card}>
      <Text style={s.muted}>{title}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f5f6f8',
    padding: 18,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 25,
  },
  sub: {
    color: '#666',
    marginBottom: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    width: '48%',
    minHeight: 85,
  },
  muted: {
    color: '#707070',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },
  h: {
    fontSize: 19,
    fontWeight: '700',
    marginTop: 22,
    marginBottom: 10,
  },
  box: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  row: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
  },
  small: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  module: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  moduleText: {
    fontWeight: '700',
  },
});
