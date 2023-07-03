
export default function useRegion(region) {
    console.log(region)
}

async function getProvinces() {
    try {
        const response = await axios.get(`location/provinces`, {
        headers: {
            "Content-Type": "application/json",
        },
        });
        setProvinces(response.data?.data);
    } catch (e) {
        console.error(e);
    }
}
async function getCities(id) {
    try {
        const response = await axios.get(`location/province/cities/${id}`, {
        headers: {
            "Content-Type": "application/json",
        },
        });
        setCities(response.data?.data);
    } catch (e) {
        console.error(e);
    } 
}
async function getDistricts(id) {
    try {
        const response = await axios.get(`location/province/city/districts/${id}`, {
        headers: {
            "Content-Type": "application/json",
        },
        });
        setDistricts(response.data?.data);
    } catch (e) {
        console.error(e);
    }
}
async function getCodes(id) {
    try {
        const response = await axios.get(
        `location/province/city/district/villages/${id}`,
        {
            headers: {
            "Content-Type": "application/json",
            },
        }
        );
        setCodes(response.data?.data);
    } catch (e) {
        console.error(e);
    }
}

