console.log('overview.js loaded');

async function init(){
    console.log('init called');
}

async function init(){
    const checkLogin = await fetch('/api/user/check', {
        credentials: 'include'
    });

    console.log('checkLogin status:', checkLogin.status);

    if(!checkLogin.ok){ window.location.href = 'login.html';}

    const userName = document.getElementById('user-name');
    const namaTersimpan = localStorage.getItem('userName');

    if(namaTersimpan !== null){
        userName.textContent = namaTersimpan;
    }

    const tanggal = document.getElementById('current-date');
    const hari = new Date();
    const formatTanggal = hari.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    tanggal.textContent = formatTanggal;

    const resBudget = await fetch('/api/budget', {
        method : 'GET',
        credentials : 'include'
    })

    const budgetData = await resBudget.json();

    if(budgetData.length === 0){
        window.location.href = 'budget.html'
    }else {
        budgetData[0].sisa = budgetData[0].total - budgetData[0].terpakai;
        const totalBudget = document.getElementById('total-budget-amount');
        totalBudget.textContent = 'Rp ' + budgetData[0].total.toLocaleString('id-ID');
        const budgetTerpakai = document.getElementById('terpakai-amount');
        const sisaBudget = document.getElementById('sisa-budget-amount');
        budgetTerpakai.textContent = 'Rp ' + budgetData[0].terpakai.toLocaleString('id-ID');
        sisaBudget.textContent = 'Rp ' + budgetData[0].sisa.toLocaleString('id-ID');
    }

    async function renderTransaksiHariIni(){
        const resTransaksi = await fetch('/api/transaksi',{
            method : 'GET',
            credentials : 'include'
        });

        const transaksi = await resTransaksi.json();
        
        const hariIni = new Date().toISOString().split('T')[0]
        const transaksiHariIni = transaksi.filter(function(item){
        return item.tanggal === hariIni})

        const listTransaksiHariIni = document.getElementById('transaksi-hari-ini-list');
        listTransaksiHariIni.innerHTML = '';

        transaksiHariIni.forEach(function(item){
            listTransaksiHariIni.innerHTML += '<li>' + item.nama + ' - Rp ' + item.nominal.toLocaleString('id-ID') + ' - ' + item.tanggal + '</li>'
        });

    }

    await renderTransaksiHariIni();

    async function kategoriOverview(){
        const resKategori = await fetch('/api/kategori', {
            method : 'GET',
            credentials : 'include'
        });
        const kategori = await resKategori.json();
        
        const resTransaksiKategori = await fetch('/api/transaksi', {
            method : 'GET',
            credentials : 'include'
        });
        const transaksiKat = await resTransaksiKategori.json();

        const kategoriList = document.getElementById('kategori-list');
        kategoriList.innerHTML = '';

        kategori.forEach(function(item){
            const transaksiKategori = transaksiKat.filter(function(trx){
                return trx.jenis === item.nama;
            })

            const terpakai = transaksiKategori.reduce(function(total, trx){
                return total + trx.nominal;
            }, 0)

            const persen = terpakai / item.nilai * 100;
            const sisa = item.nilai - terpakai;

            kategoriList.innerHTML += '<li>' + item.nama + ' - Rp ' + item.nilai.toLocaleString('id-ID') + ' - Terpakai: Rp ' + terpakai.toLocaleString('id-ID') + ' - Sisa: Rp ' + sisa.toLocaleString('id-ID') + ' - (' + persen.toFixed(2) + '%)' + '</li>'
        })
        
    }

    await kategoriOverview();
}

init();