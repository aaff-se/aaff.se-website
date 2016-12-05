import hasher from 'lib/hasher';
import log from 'lib/log';


const cacheLayer = function cacheLayer() {

let memoryBank = {};

	const supportsSessionStorage = ( (typeof(Storage) !== "undefined") && (typeof(Storage) !== "undefined") && (typeof sessionStorage !== 'undefined') );
	
	
	//used for the server - maybe we should push this to the client later?
	const internalJsMemoryProvider = function internalJsMemoryProvider(){
		
		const save = function save(content,hash) {
			if(!hash) 
				return undefined;
			memoryBank[hash] = content;
		};
		
		const load = function load(hash) {
			if(!hash) 
				return undefined;
			if(memoryBank)
				return memoryBank[hash];
			return undefined;
		};
		const loadAll = function loadAll() {
			if(memoryBank)
				return memoryBank;
			return undefined;
		};
		return {
			save: save,
			load: load,
			loadAll: loadAll
		};
	};
	
	//maybe as no cache backup...
	const nullProvider = function nullProvider(){
		
		const nullfunc = function nullfunc() {
		};
		
		return {
			save: nullfunc,
			load: nullfunc,
			loadAll: nullfunc
		};
	};
	
	//used for client
	const sessionStorageProvider = function sessionStorageProvider() {
		
		const save = function save(content,hash) {
			sessionStorage[hash] = JSON.stringify(content);
		};
		
		const load = function load(hash) {
			let content = sessionStorage[hash];
			if(content)
				return JSON.parse(content);
			return undefined;
		};
		const loadAll = function loadAll() {
			// shouldnt be used in client
			return false;
/*
			let content = sessionStorage;
			if(content)
				return JSON.parse(content);
			return undefined;
*/
		};
		
		return {
			save: save,
			load: load,
			loadAll: loadAll
		};
	};
	
	const storage = (supportsSessionStorage) ? sessionStorageProvider() : internalJsMemoryProvider();
	
	//get cached content
	const getContent = function getContent( loadObj ){
		if(loadObj === null) return false;
		let allContent = storage.load();

		const urlHash = hasher(loadObj.url);
		let content = storage.load(urlHash);
		if(content !== undefined && content.timestamp >= loadObj.timestamp ) {
			return content;
		} else {
			return false;
		}
	};
	const getAllContent = function getAllContent(){

		return storage.loadAll();

	};
	
	//save to cache
	const setContent = function setContent(contentObj){
		
		//Get content cache
		const urlHash = hasher(contentObj.url);
		
		//Save content cache to hash
		storage.save(contentObj, urlHash);
	};
	//save to cache
	const maybeSetAllContent = function maybeSetAllContent(initCache){
		if(!initCache) return false;
		
		//itirate over the cache
		Object.keys(initCache).forEach(function(key) {
			let obj = initCache[key];
			//check if we have a newer cache already
			if(getContent(obj))
				return false;
			setContent(obj);
		});
	};



	//maybe overwrite session storage with server provided cache
	if(supportsSessionStorage && initCache) {
		//save the current page data as well
		maybeSetAllContent(initCache);
	}


	return {
		get:getContent,
		getAll:getAllContent,
		set:setContent,
	};
}();

export default cacheLayer;
