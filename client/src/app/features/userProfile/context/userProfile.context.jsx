import { createContext, useState, useMemo } from 'react';

export const UserProfileContext = createContext(null);

// Premium mockup trips used as fallback if database has no records
const mockTripsList = [
    {
        id: 'mock-trip-1',
        name: 'Japan Autumn Adventure',
        destination: 'Tokyo • Kyoto • Osaka',
        startDate: '2026-10-12',
        endDate: '2026-10-28',
        coverPhotoUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCi_13WWSYLyVJnEIW_ZiFZlNhO9BPZA1inA6n6wHMkGxP1vL0-R76O_fyqfkFqqHkiMkbemsE006e0b_xnmU9sk2guwRauhXq4rUuqYf3VnipSyTRYyYv0odg-Uh-ZuB3-pct0IdXW8Ojzbm4ezRRJpo7rsobcbb9wj-zLsZW7piLJkCjwuHaNShOa-c-XVMTrsDBdxAf1GJeMF5zv5Us-rx7RPQZU3_MK76yu9Cm-qu_UCo2ci5uh',
        status: 'ongoing',
        progress: 72,
        weather: 'Kyoto 18°C',
        budgetAmount: '5000',
        budgetCurrency: 'USD',
        countries: ['Japan'],
    },
    {
        id: 'mock-trip-2',
        name: 'Alpine Retreat Switzerland',
        destination: 'Zurich • Zermatt • Lucerne',
        startDate: '2026-09-05',
        endDate: '2026-09-12',
        coverPhotoUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCsqa5PQ9ybRN689eK7E052r4ErDbQE3x7tYpcAa0Avbco02AW9USEX6gQZglIL6Iu0fmctnDxku0LDt1XZAmhmUJu9zlyJffiOABnod1x6JZYj1myhPJXJsYHd5SHCzWkcZnCT5xvccPnTWqLaSLrDKNZhQdbuj5v7Tnjxbt8m_aIKBhsaTjaNsqvXQXAhuusjPLRahksckqVDpAZqyJ-P8hNZYc2SLoTvwWaBC80k4AgfSCBAsYzq',
        status: 'planned',
        daysToStart: 14,
        budgetAmount: '4200',
        budgetCurrency: 'USD',
        countries: ['Switzerland'],
    },
    {
        id: 'mock-trip-3',
        name: 'Bali Serenity Escape',
        destination: 'Ubud • Seminyak • Uluwatu',
        startDate: '2026-10-06',
        endDate: '2026-10-20',
        coverPhotoUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCkcRnl07JJyYTMOGk9rKcAN-p38Z65a9UWrxo7NRc8SQ01Qpwy70IxVJQ-1Ae90Csek4Qyz5_pyxedPNKUWS4EByu3JJchtXHca2O6HRHdNfP8L8fhdxLK9iYx5Wpri27NNaHVeKcFPBPlx09c__TT5EHLN1oB9npTh46My6Wqo3OIGrzqRPi25M4wxyEHwerSbnsgV0ru9jtC_SG_9fltJs4eF6uLtXzGDrmhu4WjKbewmeQG_T1Y',
        status: 'planned',
        daysToStart: 45,
        budgetAmount: '2800',
        budgetCurrency: 'USD',
        countries: ['Indonesia'],
    },
    {
        id: 'mock-trip-4',
        name: 'Kyoto Cultural Immersion',
        destination: 'Kyoto, Japan',
        startDate: '2026-09-03',
        endDate: '2026-09-10',
        coverPhotoUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCARuFu7sNzmoRuL9_POBme7ncPcScG7Vk_0cuIeDrKc0LPqKT0VdoeOKI4ZvhtiFLzpj7q-SQXsI8N0IO-9zI2fmUo6iSFo0R6HkcIG75Do_kUHg_dzkrbjmhakH5P4qIh4m2od6bY9rDGxaIegB0X7Bk3UgD0KZMQH3HWrV8JTyMCUb5286_xb3eVKXx4hvSt-l_CyGAlW7vSXzQBtWUUkNkkpDeRawHmtkWi9vCNLpyQCUfp1a2x',
        status: 'planned',
        daysToStart: 12,
        budgetAmount: '2100',
        budgetCurrency: 'USD',
        countries: ['Japan'],
    },
    {
        id: 'mock-trip-5',
        name: 'Swiss Alps Retreat',
        destination: 'Zermatt, Switzerland',
        startDate: '2026-10-06',
        endDate: '2026-10-15',
        coverPhotoUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDOVIORXFRNlo_ErxGOk_E_4zTl-J9AbJPkPWqYfQPxitUNzlPTG0c8qbtbMla4n8eadqSS20uRT6G1ZdbpiINlFiSkA8dTAZCTaHtM3HYczjNybZpZvOhjhK1ut2R40uYA9wRhL_JV4cceM5jBRo0II6-gGskVqheIKqzDYdSwdVbBT3tyfvv6j-5LGYJA_z2DP07cssehYDGqPKjXvMDXmqPTP-uOTz6cRJbUDb1SimB9bQyve2Hy',
        status: 'planned',
        daysToStart: 45,
        budgetAmount: '3500',
        budgetCurrency: 'USD',
        countries: ['Switzerland'],
    },
    {
        id: 'mock-trip-6',
        name: 'Bali Tropical Escape',
        destination: 'Bali, Indonesia',
        startDate: '2026-11-20',
        endDate: '2026-11-30',
        coverPhotoUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAeWKPnaVBIDS9jeIIf1sIlXJpJuoB8h5MgAFh32dysAr1uwSwre-p20SMnjR-L-SV6QRWN_jt8hMim4byB0mjQ4SKDnedMdBfNU4eoG10PTDNB_JO8nWzPO_17blT6unCWCRLdCtMrRghoJIC_b58fHpIqsz4tvRKJG3rMPxLlbcPjyl78zlSaM6T3dSoN-WDcr6Iw5t-RuyspmP2CC9ckZ46fR8GvvLrsx5rnn4-x4DE87vDEpj39',
        status: 'planned',
        daysToStart: 90,
        budgetAmount: '3200',
        budgetCurrency: 'USD',
        countries: ['Indonesia'],
    },
    {
        id: 'mock-trip-7',
        name: 'Rajasthan Heritage Tour',
        destination: 'India • Jan 2024 • 12 Days',
        startDate: '2024-01-05',
        endDate: '2024-01-17',
        coverPhotoUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCU7hIUnoCLoRhvpKddEmB4G8xnCOUP7yvLSXyFhCQ8E70CJBfDRHMkhK7ZjtjtJoZk_mjIl0ISctg0LVhiGkFFZXmxwGUSNmS0ekjZ96-QtxnTpLVmp9xqy3MNC3S1OSvjWUIN-0gdpcoaRS41BmrivsG4Qps6TvB3KwBqcEozGTosd5n9Kljhed5pNz2h5XLSN8e8B8bU4gALCNMVuNBqiWNcVHdVwPB4RYYXoGqHubY7vh879Qht',
        status: 'completed',
        spent: 3150,
        rating: 4.9,
        countries: ['India'],
    },
    {
        id: 'mock-trip-8',
        name: 'Thailand Backpacking',
        destination: 'Thailand • Nov 2023 • 21 Days',
        startDate: '2023-11-01',
        endDate: '2023-11-22',
        coverPhotoUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDs3Qi8nlpp8Ge5R0i5Re6Ua05HRVpqGoq9DXsdAFTLdPLfYwTb7AADcd7rbB8v9R3whc4nYKjzk2R6yO7hJMmlrO7U1eb6xJyoe-UEC7dVmPD9GELMsyf0a5toaaDiL0llHtrYTpmSsuI6V_eKQg-07svYbaWq5glaEuP_VievrxranHYkQvwlBInUL4W5_7FN0W3Ad9rITuTDJXsVkdpPBVMufaPm_q9qI8HcI3SUXokOQ9DPRfIG',
        status: 'completed',
        spent: 1800,
        rating: 4.8,
        countries: ['Thailand'],
    },
    {
        id: 'mock-trip-9',
        name: 'Parisian Getaway',
        destination: 'France • Sept 2023 • 7 Days',
        startDate: '2023-09-10',
        endDate: '2023-09-17',
        coverPhotoUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCyvN6nJ-lOqYBEMmofiUDCMQePjohflWvFDvmuJzDzTVNH4m7ofxs4QanD5jPhY5OeLnIeo_c0TWc5vCuSqZ2EZ_csDklj7kWES6M0tJs_FMsZAt5Zwm-jJe02m9FXpv9NbiWLHKVkYkN_H3GJqkZLAXnfWZBzCVxNW6fFLrfQhzF6-lkntizWqcwSDMWEBruTaBd9Kg5CInK1OMjcH8cr3OvbiQBnp7fSMoL8kuhqtGDayeX5WWgu',
        status: 'completed',
        spent: 2400,
        rating: 5.0,
        countries: ['France'],
    },
    {
        id: 'mock-trip-10',
        name: 'Parisian Weekend',
        destination: 'Paris, France',
        startDate: '2023-06-03',
        endDate: '2023-06-05',
        coverPhotoUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAoDaqXsaxNp3ZgLhcoSeRumZB3eXGo2TyUm6p5ELbrF2yjo0TDdlNC2cOkwOJck8sxHYBBS0fLeg6kzqPXUTajc-MNzPZFzsFQeyeFEoJm-GiEgpcfG9laFhmFxTzzKHPxpHN3efp7lGSfstGhwfvTILfd04bvYs1v5-Qg3Rsoa78tUOZgXgjUT60COKRTYSucEQtF4R1TSFWmzr4F2OjQE04grnpFCGi-M8WLG-O0FI_twnIvBtR6',
        status: 'completed',
        rating: 5.0,
        countries: ['France'],
    },
];

export function UserProfileProvider({ children }) {
    const [trips, setTrips] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
    const [isMock, setIsMock] = useState(false);

    // Derived statistics computed reactively from active list of trips
    const stats = useMemo(() => {
        const totalTrips = trips.length;
        const ongoingCount = trips.filter((t) => t.status === 'ongoing').length;
        const upcomingCount = trips.filter((t) => t.status === 'planned').length;

        // Collect all distinct countries visited
        const countriesSet = new Set();
        trips.forEach((t) => {
            if (t.countries && Array.isArray(t.countries)) {
                t.countries.forEach((c) => countriesSet.add(c));
            } else if (t.destination) {
                // Heuristic extraction
                const parts = t.destination.split(/[•,·]/).map((p) => p.trim());
                parts.forEach((p) => {
                    if (p.toLowerCase().includes('japan')) countriesSet.add('Japan');
                    if (p.toLowerCase().includes('switzerland')) countriesSet.add('Switzerland');
                    if (p.toLowerCase().includes('indonesia') || p.toLowerCase().includes('bali'))
                        countriesSet.add('Indonesia');
                    if (p.toLowerCase().includes('france')) countriesSet.add('France');
                    if (p.toLowerCase().includes('india')) countriesSet.add('India');
                    if (p.toLowerCase().includes('thailand')) countriesSet.add('Thailand');
                    if (p.toLowerCase().includes('italy')) countriesSet.add('Italy');
                });
            }
        });

        // Mock UI default falls back to 12 countries if empty database
        const countriesCount = isMock ? 12 : Math.max(countriesSet.size, 1);

        return {
            totalTrips: isMock ? 18 : totalTrips,
            ongoingCount: isMock ? 3 : ongoingCount,
            upcomingCount: isMock ? 5 : upcomingCount,
            countriesCount: countriesCount,
        };
    }, [trips, isMock]);

    const value = useMemo(
        () => ({
            // Read Path values
            trips,
            dashboardData,
            loading,
            error,
            pagination,
            stats,
            isMock,

            // Setters for hooks
            setTrips,
            setDashboardData,
            setLoading,
            setError,
            setPagination,
            setIsMock,
            mockTripsList,
        }),
        [trips, dashboardData, loading, error, pagination, stats, isMock],
    );

    return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}
