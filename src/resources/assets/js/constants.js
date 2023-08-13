export const Employees = [
    {
        id: 1,
        names: "Galen Slixby",
        email: "s.galen@email.hp",
        phone: "+250757205189",
        nid: "4823401293574923",
        image: "assets/img/avatar-1.png",
        position: "Doctor",
        hp: "Kacyiru Health Centre",
        department: "Medical Services",
    }
];

export const HealthPosts = [
    {
        id: 1,
        name: "Kacyiru Health Centre",
        type: "Hospital",
        location: {
            province: "Kigali City",
            district: "Nyarugenge",
            sector: "Kacyiru",
            cell: "Murunga",
        },
    }
];

export const districtsByProvince = {
    kigali: ['Gasabo', 'Kicukiro', 'Nyarugenge'],
    north: ['Burera', 'Gicumbi'],
    // ... (other provinces and districts)
};

export const sectorsByDistrict = {
    Gasabo: ['Remera', 'Gatsata'],
    Kicukiro: ['Gahanga', 'Kagarama'],
    Nyarugenge: ['Cyaruhogo', 'Kiyovu'],
    Burera: ['Cyanika', 'Butaro'],
    Gicumbi: ['Gicumbi', 'Byumba'],
    // ... (other districts and sectors)
};

export const cellsBySector = {
    Remera: ['Giporoso', 'Kagunga', 'Kimicanga'],
    Gatsata: ['Bweramvura', 'Gatsata', 'Nyabisindu'],
    Gahanga: ['Cell1', 'Cell2', 'Cell3'],
    Kagarama: ['Cell4', 'Cell5', 'Cell6'],
    // ... (other sectors and cells)
};