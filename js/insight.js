async function checkAuth(){
    const checkLogin = await fetch('https://lokost-backend-production.up.railway.app/api/user/check', {
        credentials: 'include'
    });
    if(!checkLogin.ok) window.location.href = 'login.html';
}

checkAuth();

async function init(){
    const budgetRes = await fetch(`https://lokost-backend-production.up.railway.app/api/budget`, {
        method : "GET",
        credentials : 'include'
    })
    const budgetData = await budgetRes.json()
    
    const transaksiRes = await fetch(`https://lokost-backend-production.up.railway.app/api/transaksi`,{
        method : "GET",
        credentials : 'include'
    })
    const transaksiData = await transaksiRes.json()

    const sisaBudget = budgetData[0].total - budgetData[0].terpakai;
    const persenSisa = (sisaBudget / budgetData[0].total) * 100;
    const statusBudget = document.getElementById('status-keuangan');

    let status = '';
    let warna = '';

    if(persenSisa > 30){
        status= ' Stabil';
        warna= 'green';
    }else if(persenSisa > 15 && persenSisa <= 30){
        status= ' Waspada';
        warna= 'orange';    
    }else if(persenSisa <= 15){
        status= ' Miris';
        warna= 'red';
    }

    statusBudget.innerHTML = `<h3>Status Keuangan : </h3><p> ${status} </p>`
    statusBudget.style.color = warna;

    // kategori terbesar
    const tampung = {};

    const filterTransaksi = transaksiData.filter(function(item){
        return item.jenis !== 'tambahan budget';
    });

    filterTransaksi.forEach(function(item){
        if(tampung[item.jenis]){
            tampung[item.jenis] += item.nominal;

        }else{
            tampung[item.jenis] = item.nominal;
        }
    })

    let kategoriTerbesar = '';
    let nilaiTerbesar = 0;

    Object.keys(tampung).forEach(function(kategori){
        if(tampung[kategori] > nilaiTerbesar){
            nilaiTerbesar = tampung[kategori];
            kategoriTerbesar = kategori;
        }
    })


    const kategoriTerbesarEl = document.getElementById('kategori-terbesar-keuangan');
    kategoriTerbesarEl.innerHTML = `<h3>Kategori Pengeluaran Terbesar</h3><p>${kategoriTerbesar} - Rp ${nilaiTerbesar.toLocaleString('id-ID')}</p>`

    // rata" pengeluaran

    const hariUnik = new Set()
    const bulanUnik = new Set()
    let totalNominal = 0;

    filterTransaksi.forEach(function(item){
        totalNominal += item.nominal;
        hariUnik.add(item.tanggal);
        bulanUnik.add(item.tanggal.slice(0,7));

    })

    const bulanIni = new Date().toISOString().slice(0,7);
    const transaksiIni = filterTransaksi.filter(function(item){
        return item.tanggal.slice(0,7) === bulanIni;
    });

    const hariUnikBulanIni = new Set()
    transaksiIni.forEach(function(item){
        hariUnikBulanIni.add(item.tanggal);
    })

    const totalNominalBulanIni = transaksiIni.reduce(function(sum, item){
        return sum + item.nominal;
    }, 0);

    const rataBulanan = totalNominalBulanIni / hariUnikBulanIni.size;

    const rataHarian = totalNominal / hariUnik.size;
    const rataRata = document.getElementById('rata-rata-keuangan');
    rataRata.innerHTML = `<h3>Rata-rata Pengeluaran</h3><p>total: Rp ${rataHarian.toLocaleString('id-ID')} - Bulanan: Rp ${rataBulanan.toLocaleString('id-ID')}</p>`

    // grafik
    const tampungBulan = {};

    filterTransaksi.forEach(function(item){
        const kunci = item.tanggal.slice(0,7);
        if(tampungBulan[kunci]){
            tampungBulan[kunci] += item.nominal;
        }else{
            tampungBulan[kunci] = item.nominal;
        }
    })

    const semuaBulan = Object.keys(tampungBulan).sort();
    const limaBulanTerakhir = semuaBulan.slice(-5);

    const labels = limaBulanTerakhir;
    const data = limaBulanTerakhir.map(function(bulan){
        return tampungBulan[bulan];
    })

    const canvas = document.getElementById('grafik-bulanan');
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pengeluaran per Bulan',
                data: data
            }]
        }
    })
}

init();