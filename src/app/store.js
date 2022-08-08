import { configureStore } from '@reduxjs/toolkit';
import { mainSlice } from '../features/main/mainSlice';
import { bannerSlice } from '../features/Banners/bannerSlice';
import { settingSlice } from '../features/Setting/settingSlice';
import { membersSlice } from '../features/Members/membersSlice';
import { faqSlice } from '../features/Faq/faqSlice';
import { levelSlice } from '../features/Level/levelSlice';
import { usersSlice } from '../features/Users/usersSlice';
import { asuransiSlice } from '../features/Asuransi/asuransiSlice';
import { bongkarmuatSlice } from '../features/BongkarMuat/bongkarmuatSlice';
import { outletsSlice } from '../features/Outlets/outletsSlice';
import { cargoSlice } from '../features/Cargo/cargoSlice';
import { provSlice } from '../features/Area/provSlice';
import { citySlice } from '../features/Area/citySlice';
import { kecSlice } from '../features/Area/kecSlice';
import { kelSlice } from '../features/Area/kelSlice';
import { mappingAreaSlice } from '../features/Area/mappingAreaSlice';
import { biSlice } from '../features/BiayaInap/biSlice';
import { pricelistSlice } from '../features/PriceList/pricelistSlice';
import { transaksiSlice } from '../features/Transaksi/transaksiSlice';
import { driversSlice } from '../features/Drivers/driversSlice';

export const store = configureStore({
  reducer: {
    main: mainSlice.reducer,
    banners: bannerSlice.reducer,
    settings: settingSlice.reducer,
    members: membersSlice.reducer,
    faq: faqSlice.reducer,
    level: levelSlice.reducer,
    usersAdm: usersSlice.reducer,
    asuransi: asuransiSlice.reducer,
    bongkarMuat: bongkarmuatSlice.reducer,
    outlets: outletsSlice.reducer,
    cargo: cargoSlice.reducer,
    provinsi: provSlice.reducer,
    city: citySlice.reducer,
    kecamatan: kecSlice.reducer,
    kelurahan: kelSlice.reducer,
    mappingArea: mappingAreaSlice.reducer,
    biayaInap: biSlice.reducer,
    pricelists: pricelistSlice.reducer,
	transaksi: transaksiSlice.reducer,
	drivers: driversSlice.reducer,
  },
});
