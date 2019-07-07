import { Injectable } from '@angular/core';
import {
	AngularFirestore,
	AngularFirestoreCollection,
	AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { firestore } from 'firebase/app';

import { Product, CategoryList, SaleData } from '../interfaces';

@Injectable({
	providedIn: 'root'
})
export class DataService {
	categoriesDoc: any;
	categoriesObservable: Observable<any>;
	categories: string[];

	productsCollection: AngularFirestoreCollection<Product>;
	products: Product[];

	constructor(private afs: AngularFirestore) {
		this.categoriesDoc = this.afs.doc('general/categories');
		this.categoriesObservable = this.categoriesDoc.valueChanges();
		this.categoriesObservable.subscribe(val => (this.categories = val.list));

		this.productsCollection = afs.collection('products');
		this.productsCollection.valueChanges().subscribe(val => (this.products = val));
	}

	async addNewProduct(product: Product) {
		try {
			await this.productsCollection.doc(`${product.category}-${product.name}`).set(product);
		} catch (err) {
			throw err;
		}
	}

	async addNewCategory(category: string) {
		try {
			this.categoriesDoc.update({
				list: firestore.FieldValue.arrayUnion(category)
			});
		} catch (err) {
			throw err;
		}
	}

	async executeSale(saleDataList: SaleData[]) {
		const batch: firestore.WriteBatch = this.afs.firestore.batch();
		saleDataList.forEach(saleData => {
			const productRef: firestore.DocumentReference = this.productsCollection.doc(
				`${saleData.category}-${saleData.name}`
			).ref;
			batch.update(productRef, {
				quantity: firestore.FieldValue.increment(-saleData.quantity)
			});
		});
		batch.commit();
	}
}
