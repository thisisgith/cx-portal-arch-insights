import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Service for general application utilities
 */
@Injectable({
	providedIn: 'root',
})
export class UtilsService {
	constructor (@Inject(DOCUMENT) private document) { }
	/**
	 * Initializes a download given an URL
	 * @param url - URL of asset to for download
	 */
	public download (url: string) {
		const a = this.document.createElement('a');
		a.href = url;
		const fileName = url.split('/')
			.pop();
		a.download = fileName;
		this.document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		a.remove();
	}
	/**
	 * Sets a js object to localStorage
	 * @param key {string}
	 * @param obj {object}
	 */
	public setLocalStorage (key: string, obj: object) {
		localStorage.setItem(key, JSON.stringify(obj));
	}
	/**
	 * Retrieves a js object from localStorage
	 * @param key {string}
	 * @returns obj {object}
	 */
	public getLocalStorage (key: string) {
		try {
			return JSON.parse(localStorage.getItem(key));
		} catch (e) {
			return null;
		}
	}
}
