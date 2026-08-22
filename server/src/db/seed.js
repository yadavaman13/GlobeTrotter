import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db, pool } from '../config/database.config.js';
import {
    users,
    cities,
    activities,
    activityImages,
    trips,
    tripStops,
    tripStopActivities,
    tripCostItems,
    savedDestinations,
    tripShares,
} from './schema/schema.js';
import { eq, and } from 'drizzle-orm';

// ----------------------------------------------------
// 1. SEED CREDENTIALS (11 Users & Admins)
// ----------------------------------------------------
const SEED_USERS_DATA = [
    {
        firstName: 'Aryan',
        lastName: 'Patel',
        email: 'aryanpatel.me@gmail.com',
        rawPassword: 'Aryan@123',
        role: 'admin',
        emailVerified: true,
        isActive: true,
        isDeleted: false,
    },
    {
        firstName: 'Itesh',
        lastName: 'Prajapati',
        email: 'iteshofficial@gmail.com',
        rawPassword: 'Itesh@123',
        role: 'admin',
        emailVerified: true,
        isActive: true,
        isDeleted: false,
    },
    {
        firstName: 'Ankur',
        lastName: 'Singh',
        email: 'asr24983@gmail.com',
        rawPassword: 'Asr@123',
        role: 'user',
        emailVerified: true,
        isActive: true,
        isDeleted: false,
    },
    {
        firstName: 'Aman',
        lastName: 'Yadav',
        email: 'yadavaman1948@gmail.com',
        rawPassword: 'Aman@123',
        role: 'admin',
        emailVerified: true,
        isActive: true,
        isDeleted: false,
    },
    {
        firstName: 'Khilan',
        lastName: 'Patel',
        email: 'leopatel967@gmail.com',
        rawPassword: 'Leo@123',
        role: 'user',
        emailVerified: true,
        isActive: true,
        isDeleted: false,
    },
    {
        firstName: 'Shantanu',
        lastName: 'Chaubey',
        email: 'doomwiser@gmail.com',
        rawPassword: 'Doom@123',
        role: 'user',
        emailVerified: true,
        isActive: true,
        isDeleted: false,
    },
    {
        firstName: 'Priya',
        lastName: 'Soni',
        email: 'priya@gmail.com',
        rawPassword: 'Priya@123',
        role: 'user',
        emailVerified: true,
        isActive: true,
        isDeleted: false,
    },
    {
        firstName: 'Ayush',
        lastName: 'Pandey',
        email: 'work.yadavaman@gmail.com',
        rawPassword: 'Aman@123',
        role: 'user',
        emailVerified: true,
        isActive: true,
        isDeleted: false,
    },
    {
        firstName: 'Sammy',
        lastName: 'Patel',
        email: 'skyh53624@gmail.com',
        rawPassword: 'Sky@123',
        role: 'user',
        emailVerified: true,
        isActive: true,
        isDeleted: false,
    },
    {
        firstName: 'Rohan',
        lastName: 'Sharma',
        email: 'rohan.sharma@gmail.com',
        rawPassword: 'Rohan@123',
        role: 'user',
        emailVerified: true,
        isActive: true,
        isDeleted: false,
    },
    {
        firstName: 'Neha',
        lastName: 'Verma',
        email: 'neha.verma@gmail.com',
        rawPassword: 'Neha@123',
        role: 'user',
        emailVerified: true,
        isActive: true,
        isDeleted: false,
    },
];

// ----------------------------------------------------
// 2. SEED INDIAN CITIES DATA (12 Major Hubs)
// ----------------------------------------------------
const SEED_INDIAN_CITIES = [
    {
        name: 'Jaipur',
        country: 'India',
        region: 'Rajasthan',
        costIndex: '3.50',
        popularity: '9.50',
    },
    {
        name: 'Udaipur',
        country: 'India',
        region: 'Rajasthan',
        costIndex: '4.00',
        popularity: '9.20',
    },
    {
        name: 'Varanasi',
        country: 'India',
        region: 'Uttar Pradesh',
        costIndex: '2.80',
        popularity: '9.60',
    },
    {
        name: 'Goa',
        country: 'India',
        region: 'Goa',
        costIndex: '4.80',
        popularity: '9.80',
    },
    {
        name: 'Manali',
        country: 'India',
        region: 'Himachal Pradesh',
        costIndex: '3.80',
        popularity: '9.40',
    },
    {
        name: 'Munnar',
        country: 'India',
        region: 'Kerala',
        costIndex: '3.60',
        popularity: '9.10',
    },
    {
        name: 'Rishikesh',
        country: 'India',
        region: 'Uttarakhand',
        costIndex: '3.00',
        popularity: '9.40',
    },
    {
        name: 'Agra',
        country: 'India',
        region: 'Uttar Pradesh',
        costIndex: '3.20',
        popularity: '9.70',
    },
    {
        name: 'Leh-Ladakh',
        country: 'India',
        region: 'Ladakh',
        costIndex: '4.50',
        popularity: '9.60',
    },
    {
        name: 'Mumbai',
        country: 'India',
        region: 'Maharashtra',
        costIndex: '5.50',
        popularity: '9.50',
    },
    {
        name: 'Amritsar',
        country: 'India',
        region: 'Punjab',
        costIndex: '2.90',
        popularity: '9.20',
    },
    {
        name: 'Kolkata',
        country: 'India',
        region: 'West Bengal',
        costIndex: '3.00',
        popularity: '8.90',
    },
];

// ----------------------------------------------------
// 3. SEED INDIAN ACTIVITIES & IMAGES
// ----------------------------------------------------
const SEED_INDIAN_ACTIVITIES = [
    // Jaipur
    {
        cityName: 'Jaipur',
        name: 'Amber Fort Guided Heritage Walk',
        description: 'Explore the grand Rajput architecture, courtyards, and Sheesh Mahal mirror palace with a historian guide.',
        activityType: 'Heritage',
        cost: '1200.00',
        durationMinutes: 180,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
        ],
    },
    {
        cityName: 'Jaipur',
        name: 'Hot Air Balloon Safari over Pink City',
        description: 'Sunrise aerial flight drifting over historic palaces, Aravali hills, and traditional Rajasthani villages.',
        activityType: 'Adventure',
        cost: '8500.00',
        durationMinutes: 90,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80',
        ],
    },
    {
        cityName: 'Jaipur',
        name: 'Hawa Mahal Photo Walk & Street Food Tour',
        description: 'Taste authentic Pyaaz Kachori, Lassi at Lassiwala, and capture iconic views of the Palace of Winds.',
        activityType: 'Culinary',
        cost: '800.00',
        durationMinutes: 120,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1603258849045-81a179659b85?auto=format&fit=crop&w=1200&q=80',
        ],
    },

    // Udaipur
    {
        cityName: 'Udaipur',
        name: 'Lake Pichola Sunset Luxury Boat Cruise',
        description: 'Serene sunset cruise passing Jag Mandir, Taj Lake Palace, and the majestic City Palace ghats.',
        activityType: 'Sightseeing',
        cost: '1500.00',
        durationMinutes: 60,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
        ],
    },
    {
        cityName: 'Udaipur',
        name: 'City Palace Museum Tour & Crystal Gallery',
        description: 'Wander through Rajasthan’s largest royal palace complex with intricate mosaic art and royal treasures.',
        activityType: 'Heritage',
        cost: '900.00',
        durationMinutes: 150,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=1200&q=80',
        ],
    },

    // Varanasi
    {
        cityName: 'Varanasi',
        name: 'Sunrise Boat Ride on Holy Ganges & Ghat Walk',
        description: 'Witness morning rituals, temple bells, and timeless spiritual atmosphere across Dashashwamedh & Assi Ghats.',
        activityType: 'Cultural',
        cost: '700.00',
        durationMinutes: 120,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
        ],
    },
    {
        cityName: 'Varanasi',
        name: 'Evening Maha Ganga Aarti VIP Viewing',
        description: 'Mesmerizing evening prayer ritual of fire and chanting dedicated to Maa Ganga and Lord Shiva.',
        activityType: 'Cultural',
        cost: '500.00',
        durationMinutes: 90,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80',
        ],
    },

    // Goa
    {
        cityName: 'Goa',
        name: 'Scuba Diving at Grande Island & Dolphin Safari',
        description: 'PADI certified dive experience exploring coral reefs, marine life, and speed boat ride.',
        activityType: 'Adventure',
        cost: '3500.00',
        durationMinutes: 300,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        ],
    },
    {
        cityName: 'Goa',
        name: 'Dudhsagar Waterfalls Jungle Jeep Trek',
        description: 'Off-road jeep safari through Bhagwan Mahavir Wildlife Sanctuary to India’s tallest cascading waterfall.',
        activityType: 'Nature',
        cost: '2200.00',
        durationMinutes: 360,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        ],
    },

    // Manali
    {
        cityName: 'Manali',
        name: 'Solang Valley Paragliding & ATV Ride',
        description: 'Tandem paragliding with panoramic views of snow-clad Himalayan peaks and pine valleys.',
        activityType: 'Adventure',
        cost: '3200.00',
        durationMinutes: 120,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
        ],
    },
    {
        cityName: 'Manali',
        name: 'Rohtang Pass Glacier Snow Scooter Tour',
        description: 'High-altitude mountain pass adventure at 13,058 ft with breathtaking views of Pir Panjal range.',
        activityType: 'Adventure',
        cost: '4500.00',
        durationMinutes: 360,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
        ],
    },

    // Munnar
    {
        cityName: 'Munnar',
        name: 'Tea Plantation Trek & Kolukkumalai Sunrise',
        description: 'Scenic trek through misty tea gardens to the world’s highest organic tea estate for sunrise.',
        activityType: 'Nature',
        cost: '1800.00',
        durationMinutes: 240,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
        ],
    },

    // Rishikesh
    {
        cityName: 'Rishikesh',
        name: 'White Water River Rafting (Marine Drive to Shivpuri)',
        description: 'Thrilling grade III & IV rapids on the Ganges including Roller Coaster, Golf Course, and Club House.',
        activityType: 'Adventure',
        cost: '1600.00',
        durationMinutes: 180,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80',
        ],
    },
    {
        cityName: 'Rishikesh',
        name: 'Bungee Jump at Jumpin Heights (83m)',
        description: "India's highest fixed-platform bungee jump amidst the lush valleys of Mohan Chatti.",
        activityType: 'Adventure',
        cost: '4000.00',
        durationMinutes: 90,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=80',
        ],
    },

    // Agra
    {
        cityName: 'Agra',
        name: 'Taj Mahal Sunrise Guided Architectural Tour',
        description: 'Experience the ivory-white marble mausoleum at dawn when the light reflects against the Yamuna River.',
        activityType: 'Heritage',
        cost: '1100.00',
        durationMinutes: 150,
        currency: 'INR',
        images: [
            'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
        ],
    },
];

// ----------------------------------------------------
// MAIN TRANSACTIONAL SEED RUNNER
// ----------------------------------------------------
async function seedMasterData() {
    console.log('🚀 Starting GlobeTrotter Indian Transactional Seed Process...');

    await db.transaction(async (tx) => {
        // 1. Seed / Upsert Users
        console.log('\n👤 Seeding 11 Requested Users & Admins...');
        const userMap = new Map(); // email -> userId

        for (const userData of SEED_USERS_DATA) {
            const hashedPassword = await bcrypt.hash(userData.rawPassword, 10);

            const existing = await tx
                .select()
                .from(users)
                .where(eq(users.email, userData.email))
                .limit(1);

            let currentUserId;

            if (existing.length > 0) {
                const [updated] = await tx
                    .update(users)
                    .set({
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        password: hashedPassword,
                        role: userData.role,
                        emailVerified: true,
                        isActive: true,
                        isDeleted: false,
                        updatedAt: new Date(),
                    })
                    .where(eq(users.id, existing[0].id))
                    .returning();
                currentUserId = updated.id;
                console.log(`  ✓ Synced user: ${userData.firstName} ${userData.lastName} (${userData.email}) [${userData.role}]`);
            } else {
                const [inserted] = await tx
                    .insert(users)
                    .values({
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        password: hashedPassword,
                        role: userData.role,
                        emailVerified: true,
                        isActive: true,
                        isDeleted: false,
                    })
                    .returning();
                currentUserId = inserted.id;
                console.log(`  ✓ Created user: ${userData.firstName} ${userData.lastName} (${userData.email}) [${userData.role}]`);
            }

            userMap.set(userData.email, currentUserId);
        }

        // 2. Seed / Upsert Cities
        console.log('\n🏙️ Seeding Indian Travel Destinations & Cities...');
        const cityMap = new Map(); // name -> cityId

        for (const cityData of SEED_INDIAN_CITIES) {
            const existing = await tx
                .select()
                .from(cities)
                .where(and(eq(cities.country, 'India'), eq(cities.name, cityData.name)))
                .limit(1);

            let currentCityId;

            if (existing.length > 0) {
                const [updated] = await tx
                    .update(cities)
                    .set({
                        region: cityData.region,
                        costIndex: cityData.costIndex,
                        popularity: cityData.popularity,
                        updatedAt: new Date(),
                    })
                    .where(eq(cities.id, existing[0].id))
                    .returning();
                currentCityId = updated.id;
                console.log(`  ✓ Synced city: ${cityData.name}, ${cityData.region}`);
            } else {
                const [inserted] = await tx
                    .insert(cities)
                    .values(cityData)
                    .returning();
                currentCityId = inserted.id;
                console.log(`  ✓ Added city: ${cityData.name}, ${cityData.region}`);
            }

            cityMap.set(cityData.name, currentCityId);
        }

        // 3. Seed / Upsert Activities & Images
        console.log('\n🎡 Seeding Curated Indian Activities & Gallery Images...');
        const activityMap = new Map(); // name -> activityId

        for (const actData of SEED_INDIAN_ACTIVITIES) {
            const cityId = cityMap.get(actData.cityName);
            if (!cityId) {
                console.warn(`  ⚠️ City not found in DB: ${actData.cityName}`);
                continue;
            }

            const existing = await tx
                .select()
                .from(activities)
                .where(and(eq(activities.cityId, cityId), eq(activities.name, actData.name)))
                .limit(1);

            let currentActivityId;

            if (existing.length > 0) {
                const [updated] = await tx
                    .update(activities)
                    .set({
                        description: actData.description,
                        activityType: actData.activityType,
                        cost: actData.cost,
                        durationMinutes: actData.durationMinutes,
                        currency: actData.currency,
                        updatedAt: new Date(),
                    })
                    .where(eq(activities.id, existing[0].id))
                    .returning();
                currentActivityId = updated.id;
            } else {
                const [inserted] = await tx
                    .insert(activities)
                    .values({
                        cityId: cityId,
                        name: actData.name,
                        description: actData.description,
                        activityType: actData.activityType,
                        cost: actData.cost,
                        durationMinutes: actData.durationMinutes,
                        currency: actData.currency,
                    })
                    .returning();
                currentActivityId = inserted.id;
            }

            activityMap.set(actData.name, currentActivityId);

            // Seed Images for this activity
            if (actData.images && actData.images.length > 0) {
                for (let i = 0; i < actData.images.length; i++) {
                    const imgUrl = actData.images[i];
                    const existingImg = await tx
                        .select()
                        .from(activityImages)
                        .where(
                            and(
                                eq(activityImages.activityId, currentActivityId),
                                eq(activityImages.imageUrl, imgUrl),
                            ),
                        )
                        .limit(1);

                    if (existingImg.length === 0) {
                        await tx.insert(activityImages).values({
                            activityId: currentActivityId,
                            imageUrl: imgUrl,
                            displayOrder: i + 1,
                        }).returning();
                    }
                }
            }
            console.log(`  ✓ Activity: ${actData.name} (${actData.cityName}) - ₹${actData.cost}`);
        }

        // 4. Seed Multi-City Itineraries & Budget Ledgers for Seeded Users
        console.log('\n🗺️ Seeding Sample Travel Itineraries, Multi-City Stops, and Cost Ledgers...');

        const sampleTripsConfig = [
            {
                ownerEmail: 'asr24983@gmail.com', // Ankur Singh
                name: 'Royal Rajasthan Heritage Circuit',
                description: 'A 7-day royal journey across the palaces and lake vistas of Jaipur and Udaipur.',
                startDate: '2026-10-10',
                endDate: '2026-10-17',
                budgetAmount: '55000.00',
                status: 'planned',
                visibility: 'public',
                publicSlug: 'royal-rajasthan-heritage-ankur-2026',
                stops: [
                    {
                        cityName: 'Jaipur',
                        startDate: '2026-10-10',
                        endDate: '2026-10-13',
                        sequenceOrder: 1,
                        activities: ['Amber Fort Guided Heritage Walk', 'Hawa Mahal Photo Walk & Street Food Tour'],
                        expenses: [
                            { category: 'stay', amount: '12000.00', description: 'Heritage Haveli Hotel Jaipur (3 Nights)' },
                            { category: 'transport', amount: '4500.00', description: 'Delhi to Jaipur Private Cab' },
                            { category: 'activity', amount: '2000.00', description: 'Amber Fort + Hawa Mahal Tickets' },
                            { category: 'meal', amount: '3500.00', description: 'Traditional Rajasthani Thali & Street Food' },
                        ],
                    },
                    {
                        cityName: 'Udaipur',
                        startDate: '2026-10-13',
                        endDate: '2026-10-17',
                        sequenceOrder: 2,
                        activities: ['Lake Pichola Sunset Luxury Boat Cruise', 'City Palace Museum Tour & Crystal Gallery'],
                        expenses: [
                            { category: 'stay', amount: '16000.00', description: 'Lakeside Boutique Resort (4 Nights)' },
                            { category: 'transport', amount: '3500.00', description: 'Jaipur to Udaipur Express Train / Cab' },
                            { category: 'activity', amount: '2400.00', description: 'Boat Cruise & Palace Entry' },
                            { category: 'meal', amount: '4500.00', description: 'Rooftop dining overlooking Lake Pichola' },
                        ],
                    },
                ],
            },
            {
                ownerEmail: 'aryanpatel.me@gmail.com', // Aryan Patel
                name: 'Himalayan Yoga & River Adventure',
                description: 'Adrenaline and serenity in Uttarakhand and Himachal Pradesh.',
                startDate: '2026-09-01',
                endDate: '2026-09-08',
                budgetAmount: '42000.00',
                status: 'completed',
                visibility: 'public',
                publicSlug: 'himalayan-adventure-aryan-2026',
                stops: [
                    {
                        cityName: 'Rishikesh',
                        startDate: '2026-09-01',
                        endDate: '2026-09-04',
                        sequenceOrder: 1,
                        activities: ['White Water River Rafting (Marine Drive to Shivpuri)', 'Bungee Jump at Jumpin Heights (83m)'],
                        expenses: [
                            { category: 'stay', amount: '8000.00', description: 'Riverside Eco Camp Rishikesh' },
                            { category: 'activity', amount: '5600.00', description: 'Rafting + Bungee Jump Combo' },
                            { category: 'meal', amount: '2800.00', description: 'Organic cafes and German Bakery' },
                            { category: 'transport', amount: '3200.00', description: 'Volvo Bus from Delhi' },
                        ],
                    },
                    {
                        cityName: 'Manali',
                        startDate: '2026-09-04',
                        endDate: '2026-09-08',
                        sequenceOrder: 2,
                        activities: ['Solang Valley Paragliding & ATV Ride', 'Rohtang Pass Glacier Snow Scooter Tour'],
                        expenses: [
                            { category: 'stay', amount: '11000.00', description: 'Old Manali Apple Orchard Cottage' },
                            { category: 'transport', amount: '4000.00', description: 'Intercity Taxi Rishikesh to Manali' },
                            { category: 'activity', amount: '7700.00', description: 'Solang + Rohtang Pass Activities' },
                            { category: 'meal', amount: '3500.00', description: 'Trout fish and local Himachali Siddu' },
                        ],
                    },
                ],
            },
            {
                ownerEmail: 'iteshofficial@gmail.com', // Itesh Prajapati
                name: 'Coastal Goa Scuba & Sunsets',
                description: 'Relaxing 5-day coastal holiday with scuba diving at Grande Island and Dudhsagar waterfall trek.',
                startDate: '2026-11-15',
                endDate: '2026-11-20',
                budgetAmount: '38000.00',
                status: 'ongoing',
                visibility: 'public',
                publicSlug: 'goa-scuba-sunsets-itesh-2026',
                stops: [
                    {
                        cityName: 'Goa',
                        startDate: '2026-11-15',
                        endDate: '2026-11-20',
                        sequenceOrder: 1,
                        activities: ['Scuba Diving at Grande Island & Dolphin Safari', 'Dudhsagar Waterfalls Jungle Jeep Trek'],
                        expenses: [
                            { category: 'stay', amount: '15000.00', description: 'Beachfront Resort Candolim (5 Nights)' },
                            { category: 'transport', amount: '6000.00', description: 'Flights & Scooter Rental' },
                            { category: 'activity', amount: '5700.00', description: 'Scuba Diving + Dudhsagar Tour' },
                            { category: 'meal', amount: '6500.00', description: 'Goan Fish Curry, Shacks & Cafes' },
                        ],
                    },
                ],
            },
            {
                ownerEmail: 'doomwiser@gmail.com', // Shantanu Chaubey
                name: 'Spiritual Varanasi & Taj Heritage',
                description: 'Exploring spiritual traditions on the Ganges ghats and Mughal monuments in Agra.',
                startDate: '2026-12-01',
                endDate: '2026-12-06',
                budgetAmount: '28000.00',
                status: 'planned',
                visibility: 'private',
                publicSlug: 'varanasi-taj-heritage-shantanu-2026',
                stops: [
                    {
                        cityName: 'Varanasi',
                        startDate: '2026-12-01',
                        endDate: '2026-12-03',
                        sequenceOrder: 1,
                        activities: ['Sunrise Boat Ride on Holy Ganges & Ghat Walk', 'Evening Maha Ganga Aarti VIP Viewing'],
                        expenses: [
                            { category: 'stay', amount: '5500.00', description: 'Ghatside Heritage Stay' },
                            { category: 'activity', amount: '1200.00', description: 'Sunrise Boat + Aarti VIP Pass' },
                            { category: 'meal', amount: '2000.00', description: 'Kachori Gali, Tamatar Chaat & Blue Lassi' },
                            { category: 'transport', amount: '3500.00', description: 'Vande Bharat Express Ticket' },
                        ],
                    },
                    {
                        cityName: 'Agra',
                        startDate: '2026-12-04',
                        endDate: '2026-12-06',
                        sequenceOrder: 2,
                        activities: ['Taj Mahal Sunrise Guided Architectural Tour'],
                        expenses: [
                            { category: 'stay', amount: '6000.00', description: 'Taj View Hotel (2 Nights)' },
                            { category: 'activity', amount: '1100.00', description: 'Taj Mahal VIP Guided Entry' },
                            { category: 'meal', amount: '2200.00', description: 'Mughlai cuisine & Petha sampling' },
                            { category: 'transport', amount: '2500.00', description: 'Intercity Train / Cab' },
                        ],
                    },
                ],
            },
        ];

        for (const tripConfig of sampleTripsConfig) {
            const ownerUserId = userMap.get(tripConfig.ownerEmail);
            if (!ownerUserId) continue;

            const existingTrip = await tx
                .select()
                .from(trips)
                .where(eq(trips.publicSlug, tripConfig.publicSlug))
                .limit(1);

            let currentTripId;

            if (existingTrip.length > 0) {
                const [updated] = await tx
                    .update(trips)
                    .set({
                        ownerId: ownerUserId,
                        name: tripConfig.name,
                        description: tripConfig.description,
                        startDate: tripConfig.startDate,
                        endDate: tripConfig.endDate,
                        budgetAmount: tripConfig.budgetAmount,
                        status: tripConfig.status,
                        visibility: tripConfig.visibility,
                        updatedAt: new Date(),
                    })
                    .where(eq(trips.id, existingTrip[0].id))
                    .returning();
                currentTripId = updated.id;
            } else {
                const [inserted] = await tx
                    .insert(trips)
                    .values({
                        ownerId: ownerUserId,
                        name: tripConfig.name,
                        description: tripConfig.description,
                        startDate: tripConfig.startDate,
                        endDate: tripConfig.endDate,
                        budgetAmount: tripConfig.budgetAmount,
                        budgetCurrency: 'INR',
                        status: tripConfig.status,
                        visibility: tripConfig.visibility,
                        publicSlug: tripConfig.publicSlug,
                    })
                    .returning();
                currentTripId = inserted.id;
            }

            console.log(`  ✓ Trip: "${tripConfig.name}" [${tripConfig.status}]`);

            // Seed Stops, Stop Activities, and Cost Items
            for (const stopData of tripConfig.stops) {
                const cityId = cityMap.get(stopData.cityName);
                if (!cityId) continue;

                const existingStop = await tx
                    .select()
                    .from(tripStops)
                    .where(
                        and(
                            eq(tripStops.tripId, currentTripId),
                            eq(tripStops.sequenceOrder, stopData.sequenceOrder),
                        ),
                    )
                    .limit(1);

                let currentStopId;

                if (existingStop.length > 0) {
                    const [updated] = await tx
                        .update(tripStops)
                        .set({
                            cityId: cityId,
                            startDate: stopData.startDate,
                            endDate: stopData.endDate,
                            updatedAt: new Date(),
                        })
                        .where(eq(tripStops.id, existingStop[0].id))
                        .returning();
                    currentStopId = updated.id;
                } else {
                    const [inserted] = await tx
                        .insert(tripStops)
                        .values({
                            tripId: currentTripId,
                            cityId: cityId,
                            startDate: stopData.startDate,
                            endDate: stopData.endDate,
                            sequenceOrder: stopData.sequenceOrder,
                        })
                        .returning();
                    currentStopId = inserted.id;
                }

                // Seed Stop Activities
                for (let seq = 0; seq < (stopData.activities || []).length; seq++) {
                    const actName = stopData.activities[seq];
                    const actId = activityMap.get(actName);
                    if (!actId) continue;

                    const existingStopAct = await tx
                        .select()
                        .from(tripStopActivities)
                        .where(
                            and(
                                eq(tripStopActivities.tripStopId, currentStopId),
                                eq(tripStopActivities.activityId, actId),
                            ),
                        )
                        .limit(1);

                    if (existingStopAct.length === 0) {
                        await tx.insert(tripStopActivities).values({
                            tripStopId: currentStopId,
                            activityId: actId,
                            activityDate: stopData.startDate,
                            sequenceOrder: seq + 1,
                            notes: `Scheduled visit to ${actName}`,
                        }).returning();
                    }
                }

                // Seed Expenses for this stop
                for (const exp of stopData.expenses || []) {
                    const existingCost = await tx
                        .select()
                        .from(tripCostItems)
                        .where(
                            and(
                                eq(tripCostItems.tripId, currentTripId),
                                eq(tripCostItems.description, exp.description),
                            ),
                        )
                        .limit(1);

                    if (existingCost.length === 0) {
                        await tx.insert(tripCostItems).values({
                            tripId: currentTripId,
                            tripStopId: currentStopId,
                            category: exp.category,
                            description: exp.description,
                            amount: exp.amount,
                            currency: 'INR',
                            costDate: stopData.startDate,
                        }).returning();
                    }
                }
            }
        }

        // 5. Seed Saved Destinations (Bookmarks)
        console.log('\n🔖 Seeding Saved Destinations (User Bookmarks)...');
        const bookmarks = [
            { email: 'asr24983@gmail.com', cityNames: ['Goa', 'Manali', 'Munnar', 'Varanasi'] },
            { email: 'aryanpatel.me@gmail.com', cityNames: ['Leh-Ladakh', 'Udaipur', 'Jaipur'] },
            { email: 'iteshofficial@gmail.com', cityNames: ['Rishikesh', 'Goa', 'Agra'] },
            { email: 'doomwiser@gmail.com', cityNames: ['Varanasi', 'Amritsar', 'Jaipur'] },
            { email: 'priya@gmail.com', cityNames: ['Munnar', 'Udaipur', 'Goa'] },
            { email: 'rohan.sharma@gmail.com', cityNames: ['Goa', 'Manali'] },
            { email: 'neha.verma@gmail.com', cityNames: ['Jaipur', 'Udaipur'] },
        ];

        for (const bm of bookmarks) {
            const userId = userMap.get(bm.email);
            if (!userId) continue;

            for (const cityName of bm.cityNames) {
                const cityId = cityMap.get(cityName);
                if (!cityId) continue;

                const existingBm = await tx
                    .select()
                    .from(savedDestinations)
                    .where(
                        and(
                            eq(savedDestinations.userId, userId),
                            eq(savedDestinations.cityId, cityId),
                        ),
                    )
                    .limit(1);

                if (existingBm.length === 0) {
                    await tx.insert(savedDestinations).values({
                        userId: userId,
                        cityId: cityId,
                    }).returning();
                }
            }
        }

        // 6. Seed Trip Shares (Collaboration)
        console.log('\n🤝 Seeding Trip Collaborations & Shares...');
        const sharesConfig = [
            {
                tripSlug: 'royal-rajasthan-heritage-ankur-2026',
                sharedWithEmails: ['aryanpatel.me@gmail.com', 'iteshofficial@gmail.com'],
            },
            {
                tripSlug: 'himalayan-adventure-aryan-2026',
                sharedWithEmails: ['asr24983@gmail.com', 'doomwiser@gmail.com'],
            },
        ];

        for (const sh of sharesConfig) {
            const [tripRec] = await tx
                .select()
                .from(trips)
                .where(eq(trips.publicSlug, sh.tripSlug))
                .limit(1);

            if (!tripRec) continue;

            for (const sharedEmail of sh.sharedWithEmails) {
                const sharedUserId = userMap.get(sharedEmail);
                if (!sharedUserId) continue;

                const existingShare = await tx
                    .select()
                    .from(tripShares)
                    .where(
                        and(
                            eq(tripShares.tripId, tripRec.id),
                            eq(tripShares.sharedWithUserId, sharedUserId),
                        ),
                    )
                    .limit(1);

                if (existingShare.length === 0) {
                    await tx.insert(tripShares).values({
                        tripId: tripRec.id,
                        sharedWithUserId: sharedUserId,
                        createdBy: tripRec.ownerId,
                    }).returning();
                    console.log(`  ✓ Shared trip "${sh.tripSlug}" with ${sharedEmail}`);
                }
            }
        }
    });

    console.log('\n✨ Database seeding completed successfully with all 11 users and Indian travel assets!');
}

import { installProtectionTrigger } from './protect_db.js';

async function main() {
    try {
        await seedMasterData();
        await installProtectionTrigger();
    } catch (err) {
        console.error('❌ Error during seeding:', err);
        process.exit(1);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

main();
