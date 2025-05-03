   // تحديد حدود كلميم لمنع الخروج منها
   var guelmimBounds = [
	[28.9600, -10.0800], // جنوب غرب
	[29.0100, -10.0200]  // شمال شرق
];

// إنشاء الخريطة وتكبيرها داخل كلميم فقط
var map = L.map('map', {
	scrollWheelZoom: false,  // تمكين التكبير بالماوس
	zoomControl: true,       // إضافة أزرار التكبير والتصغير
	minZoom: 14,             // الحد الأدنى للتكبير (تكبير تلقائي)
	maxZoom: 20,             // الحد الأقصى للتكبير
	maxBounds: guelmimBounds,// منع الخروج من كلميم
	maxBoundsViscosity: 1.0  // فرض الحدود بشدة
}).setView([28.974592, -10.049573], 15);

// إضافة طبقة OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap contributors' 
}).addTo(map);  
  
// إضافة علامة قابلة للسحب في حي الفتح
var marker = L.marker([28.9705, -10.0559], { draggable: true }).addTo(map)
	.bindPopup("<b>حي الفتح</b><br>GYM-TMD").openPopup();

// تسجيل الإحداثيات عند تحريك العلامة
marker.on('dragend', function(event) {
	var position = event.target.getLatLng();
	console.log("تم تحريك العلامة إلى: " + position.lat + ", " + position.lng);
});