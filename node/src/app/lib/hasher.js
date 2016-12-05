export default function hasher(str) {
	let hash = 0, i, chara;
	if (str.length === 0) return hash;
	for (i = 0; i < str.length; i++) {
		chara = str.charCodeAt(i);
		hash = ((hash<<5)-hash)+chara;
		hash = hash & hash; // Convert to 32bit integer
	}
	if(hash < 0) hash = (hash *-1);
	return 'hash'+hash;
};
