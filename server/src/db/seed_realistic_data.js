import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool, db } from '../config/database.config.js';
import {
    users,
    cities,
    activities,
    trips,
    tripStops,
    tripStopActivities,
    tripCostItems,
    savedDestinations,
} from './schema/schema.js';
import { eq, and, inArray, sql } from 'drizzle-orm';


const SEED_USERS = [
    {
        firstName: 'Aryan',
        lastName: 'Patel',
        email: 'aryanpatel.me@gmail.com',
        role: 'admin',
        city: 'Ahmedabad',
        country: 'India',
        phone: '+919876543210',
        emailVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
        firstName: 'Itesh',
        lastName: 'Kumar',
        email: 'iteshofficial@gmail.com',
        role: 'admin',
        city: 'Mumbai',
        country: 'India',
        phone: '+919876543211',
        emailVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    {
        firstName: 'Aman',
        lastName: 'Yadav',
        email: 'yadavaman1948@gmail.com',
        role: 'user',
        city: 'Delhi',
        country: 'India',
        phone: '+919876543212',
        emailVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    {
        firstName: 'Ankur',
        lastName: 'Singh',
        email: 'asr24983@gmail.com',
        role: 'admin',
        city: 'Varanasi',
        country: 'India',
        phone: '+919876543213',
        emailVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    },
    {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya@gmail.com',
        role: 'user',
        city: 'Bengaluru',
        country: 'India',
        phone: '+919876543214',
        emailVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    },
    {
        firstName: 'Rohan',
        lastName: 'Sharma',
        email: 'rohan.sharma@gmail.com',
        role: 'user',
        city: 'Jaipur',
        country: 'India',
        phone: '+919876543215',
        emailVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    },
    {
        firstName: 'Neha',
        lastName: 'Verma',
        email: 'neha.verma@gmail.com',
        role: 'user',
        city: 'Goa',
        country: 'India',
        phone: '+919876543216',
        emailVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    },
    {
        firstName: 'Leo',
        lastName: 'Patel',
        email: 'leopatel967@gmail.com',
        role: 'user',
        city: 'Surat',
        country: 'India',
        phone: '+919876543217',
        emailVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    },
];

const SEED_CITIES = [
    {
        name: 'Jaipur',
        country: 'India',
        region: 'Rajasthan',
        popularity: '9.8',
        costIndex: '3.4',
    },
    {
        name: 'Goa',
        country: 'India',
        region: 'Western Coast',
        popularity: '9.7',
        costIndex: '4.2',
    },
    {
        name: 'Varanasi',
        country: 'India',
        region: 'Uttar Pradesh',
        popularity: '9.6',
        costIndex: '2.8',
    },
    {
        name: 'Udaipur',
        country: 'India',
        region: 'Rajasthan',
        popularity: '9.5',
        costIndex: '4.0',
    },
    {
        name: 'Mumbai',
        country: 'India',
        region: 'Maharashtra',
        popularity: '9.5',
        costIndex: '5.5',
    },
    {
        name: 'Kochi',
        country: 'India',
        region: 'Kerala',
        popularity: '9.3',
        costIndex: '3.6',
    },
    {
        name: 'Manali',
        country: 'India',
        region: 'Himachal Pradesh',
        popularity: '9.2',
        costIndex: '3.8',
    },
    {
        name: 'Agra',
        country: 'India',
        region: 'Uttar Pradesh',
        popularity: '9.4',
        costIndex: '3.0',
    },
    {
        name: 'Rishikesh',
        country: 'India',
        region: 'Uttarakhand',
        popularity: '9.1',
        costIndex: '2.9',
    },
    {
        name: 'Delhi',
        country: 'India',
        region: 'NCR',
        popularity: '9.4',
        costIndex: '4.5',
    },
    {
        name: 'Kyoto',
        country: 'Japan',
        region: 'Kansai',
        popularity: '9.8',
        costIndex: '7.5',
    },
    {
        name: 'Tokyo',
        country: 'Japan',
        region: 'Kanto',
        popularity: '9.9',
        costIndex: '8.2',
    },
    {
        name: 'Paris',
        country: 'France',
        region: 'Île-de-France',
        popularity: '9.7',
        costIndex: '8.8',
    },
    {
        name: 'Rome',
        country: 'Italy',
        region: 'Lazio',
        popularity: '9.6',
        costIndex: '7.8',
    },
    {
        name: 'Bali',
        country: 'Indonesia',
        region: 'Lesser Sunda',
        popularity: '9.6',
        costIndex: '4.8',
    },
    {
        name: 'Zurich',
        country: 'Switzerland',
        region: 'Canton of Zürich',
        popularity: '9.5',
        costIndex: '9.5',
    },
];

const SEED_ACTIVITIES = [
    // Jaipur
    {
        cityName: 'Jaipur',
        name: 'Amber Fort Elephant & Palace Guided Walk',
        description: 'Explore the majestic 16th-century fortress, Sheesh Mahal mirror halls, and panoramic views of Maota Lake.',
        activityType: 'cultural',
        cost: '1200.00',
        durationMinutes: 180,
    },
    {
        cityName: 'Jaipur',
        name: 'Hawa Mahal & City Palace Royal Heritage Walk',
        description: 'Step into the Palace of Winds and the museum collections of the Maharaja of Jaipur.',
        activityType: 'sightseeing',
        cost: '800.00',
        durationMinutes: 120,
    },
    {
        cityName: 'Jaipur',
        name: 'Chokhi Dhani Rajasthani Village & Feast',
        description: 'Immersive cultural celebration with traditional folk dance, fire shows, puppet performances, and authentic Dal Baati Churma.',
        activityType: 'food_dining',
        cost: '1500.00',
        durationMinutes: 240,
    },
    // Goa
    {
        cityName: 'Goa',
        name: 'Grand Island Scuba Diving & Snorkeling Experience',
        description: 'Guided underwater coral reef dive with professional PADI instructors, dolphin sighting boat ride, and BBQ lunch.',
        activityType: 'adventure',
        cost: '3500.00',
        durationMinutes: 360,
    },
    {
        cityName: 'Goa',
        name: 'Dudhsagar Waterfalls & Spice Plantation Safari',
        description: 'Jeep safari through Mollem National Park to the 4-tiered waterfalls, followed by a traditional Goan spice plantation buffet.',
        activityType: 'adventure',
        cost: '2200.00',
        durationMinutes: 420,
    },
    {
        cityName: 'Goa',
        name: 'Sunset Sailing & Yacht Cruise on Mandovi River',
        description: 'Relaxing luxury catamaran sunset cruise with live acoustic music and refreshments.',
        activityType: 'entertainment',
        cost: '2800.00',
        durationMinutes: 120,
    },
    // Varanasi
    {
        cityName: 'Varanasi',
        name: 'Dashashwamedh Ghat Grand Ganga Aarti by Boat',
        description: 'Front-row wooden boat seating for the world-famous evening oil lamp ceremony and sacred chants along the holy river.',
        activityType: 'cultural',
        cost: '950.00',
        durationMinutes: 120,
    },
    {
        cityName: 'Varanasi',
        name: 'Sunrise Rowing Boat Tour & Ancient Alleys Walk',
        description: 'Morning rowing cruise past 84 ghats followed by Kachori & Malaiyo tasting through the hidden heritage lanes.',
        activityType: 'sightseeing',
        cost: '750.00',
        durationMinutes: 150,
    },
    // Udaipur
    {
        cityName: 'Udaipur',
        name: 'Lake Pichola Sunset Boat Cruise to Jagmandir Island',
        description: 'Panoramic boat ride past City Palace and Lake Palace with golden hour views of the Aravalli hills.',
        activityType: 'sightseeing',
        cost: '1100.00',
        durationMinutes: 90,
    },
    {
        cityName: 'Udaipur',
        name: 'City Palace Museum & Crystal Gallery Tour',
        description: 'Comprehensive guided walk through Rajasthan’s largest palace complex, courtyards, and royal armory.',
        activityType: 'cultural',
        cost: '850.00',
        durationMinutes: 150,
    },
    // Mumbai
    {
        cityName: 'Mumbai',
        name: 'South Mumbai Heritage Walk & Gateway of India',
        description: 'Victorian Gothic architectural tour covering Victoria Terminus, Marine Drive, Taj Mahal Palace, and Colaba.',
        activityType: 'sightseeing',
        cost: '600.00',
        durationMinutes: 180,
    },
    {
        cityName: 'Mumbai',
        name: 'Elephanta Caves UNESCO Ferry & Guided Tour',
        description: 'Scenic Arabian Sea ferry to the 6th-century rock-cut Shiva sculptures and ancient shrines.',
        activityType: 'cultural',
        cost: '1400.00',
        durationMinutes: 300,
    },
    // Kochi
    {
        cityName: 'Kochi',
        name: 'Fort Kochi Chinese Fishing Nets & Kathakali Night',
        description: 'Walk through Portuguese colonial quarters and witness vibrant classical Kathakali dance and makeup rituals.',
        activityType: 'cultural',
        cost: '900.00',
        durationMinutes: 180,
    },
    // Agra
    {
        cityName: 'Agra',
        name: 'Taj Mahal Sunrise VIP Guided Heritage Tour',
        description: 'Beat the crowds with early morning entry to witness the marble monument of love bathe in golden sunlight.',
        activityType: 'sightseeing',
        cost: '1300.00',
        durationMinutes: 150,
    },
    // Kyoto
    {
        cityName: 'Kyoto',
        name: 'Fushimi Inari 10,000 Torii Gates & Arashiyama Bamboo Grove',
        description: 'Iconic scenic walk through vibrant vermillion shrine gates and the towering bamboo forest.',
        activityType: 'sightseeing',
        cost: '4500.00',
        durationMinutes: 240,
    },
    // Tokyo
    {
        cityName: 'Tokyo',
        name: 'Shibuya Crossing & TeamLab Planets Digital Art Museum',
        description: 'Walk the world’s busiest intersection followed by immersive water and light art installations.',
        activityType: 'entertainment',
        cost: '5200.00',
        durationMinutes: 210,
    },
    // Paris
    {
        cityName: 'Paris',
        name: 'Eiffel Tower Summit Access & Seine River Cruise',
        description: 'Skip-the-line summit elevator tickets with panoramic Parisian views followed by an evening illuminated river cruise.',
        activityType: 'sightseeing',
        cost: '6800.00',
        durationMinutes: 210,
    },
    // Rome
    {
        cityName: 'Rome',
        name: 'Colosseum Arena Floor & Roman Forum VIP Tour',
        description: 'Gladiator entrance access to the ancient amphitheater and the ruins of the Roman Empire.',
        activityType: 'cultural',
        cost: '6200.00',
        durationMinutes: 180,
    },
];

export async function seedRealisticData() {
    console.log('🌱 Starting realistic database seed...');

    const defaultHashedPassword = await bcrypt.hash('Password@123', 10);

    // 1. Seed or find Users
    console.log('👤 Seeding core realistic users...');
    const userMap = new Map();

    for (const u of SEED_USERS) {
        const existing = await db
            .select()
            .from(users)
            .where(eq(users.email, u.email))
            .limit(1);

        if (existing.length > 0) {
            userMap.set(u.email, existing[0]);
            // Update name / profile if needed
            await db
                .update(users)
                .set({
                    firstName: u.firstName,
                    lastName: u.lastName,
                    role: u.role,
                    profileImage: u.profileImage,
                    city: u.city,
                    country: u.country,
                })
                .where(eq(users.id, existing[0].id));
        } else {
            const [created] = await db
                .insert(users)
                .values({
                    firstName: u.firstName,
                    lastName: u.lastName,
                    email: u.email,
                    password: defaultHashedPassword,
                    role: u.role,
                    city: u.city,
                    country: u.country,
                    phone: u.phone,
                    emailVerified: true,
                    profileImage: u.profileImage,
                })
                .returning();
            userMap.set(u.email, created);
        }
    }
    console.log(`✅ ${userMap.size} users established.`);

    // 2. Clean dummy test cities (e.g. Venice-811rdo1v, Paris-8to7vljs)
    console.log('🧹 Cleaning dummy/randomized test city records...');
    try {
        await pool.query(`
            DELETE FROM cities 
            WHERE name LIKE '%-%' 
               OR name LIKE 'Rome-%' 
               OR name LIKE 'Tokyo-%' 
               OR name LIKE 'Kyoto-%' 
               OR name LIKE 'Paris-%' 
               OR name LIKE 'Venice-%';
        `);
    } catch {
        // Ignore foreign key restrict if referenced
    }

    // 3. Seed Realistic Cities
    console.log('🏙️ Seeding iconic travel cities...');
    const cityMap = new Map();

    for (const c of SEED_CITIES) {
        const existing = await db
            .select()
            .from(cities)
            .where(sql`LOWER(${cities.name}) = LOWER(${c.name}) AND LOWER(${cities.country}) = LOWER(${c.country})`)
            .limit(1);

        if (existing.length > 0) {
            await db
                .update(cities)
                .set({
                    popularity: c.popularity,
                    costIndex: c.costIndex,
                    region: c.region,
                })
                .where(eq(cities.id, existing[0].id));
            cityMap.set(c.name, existing[0]);
        } else {
            const [created] = await db
                .insert(cities)
                .values({
                    name: c.name,
                    country: c.country,
                    region: c.region,
                    popularity: c.popularity,
                    costIndex: c.costIndex,
                })
                .returning();
            cityMap.set(c.name, created);
        }
    }
    console.log(`✅ ${cityMap.size} cities cataloged.`);

    // 4. Seed Realistic Activities
    console.log('🎟️ Seeding curated experiences & activities...');
    const activityMap = new Map();

    for (const a of SEED_ACTIVITIES) {
        const targetCity = cityMap.get(a.cityName);
        if (!targetCity) continue;

        const existing = await db
            .select()
            .from(activities)
            .where(sql`LOWER(${activities.name}) = LOWER(${a.name}) AND ${activities.cityId} = ${targetCity.id}`)
            .limit(1);

        if (existing.length > 0) {
            activityMap.set(a.name, existing[0]);
        } else {
            const [created] = await db
                .insert(activities)
                .values({
                    cityId: targetCity.id,
                    name: a.name,
                    description: a.description,
                    activityType: a.activityType,
                    cost: a.cost,
                    durationMinutes: a.durationMinutes,
                    currency: 'INR',
                })
                .returning();
            activityMap.set(a.name, created);
        }
    }
    console.log(`✅ ${activityMap.size} curated activities indexed.`);

    // 5. Seed Realistic Trips, Stops, Scheduled Activities, and Cost Items
    console.log('✈️ Seeding realistic traveler itineraries and financial expense ledgers...');

    const aryan = userMap.get('aryanpatel.me@gmail.com');
    const itesh = userMap.get('iteshofficial@gmail.com');
    const aman = userMap.get('yadavaman1948@gmail.com');
    const ankur = userMap.get('asr24983@gmail.com');
    const priya = userMap.get('priya@gmail.com');
    const rohan = userMap.get('rohan.sharma@gmail.com');
    const neha = userMap.get('neha.verma@gmail.com');

    const TRIPS_DATA = [
        {
            owner: aryan || itesh,
            name: 'Royal Rajasthan Heritage Circuit',
            description: 'Grand journey through majestic palaces, desert forts, royal havelis, and sunset lake cruises in Jaipur and Udaipur.',
            startDate: '2026-09-10',
            endDate: '2026-09-17',
            budgetAmount: '75000.00',
            status: 'planned',
            visibility: 'public',
            publicSlug: 'royal-rajasthan-heritage-2026',
            coverPhotoUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
            stops: [
                {
                    cityName: 'Jaipur',
                    startDate: '2026-09-10',
                    endDate: '2026-09-13',
                    sequenceOrder: 1,
                    activities: [
                        { name: 'Amber Fort Elephant & Palace Guided Walk', date: '2026-09-11', startTime: '09:00:00', endTime: '12:00:00' },
                        { name: 'Hawa Mahal & City Palace Royal Heritage Walk', date: '2026-09-12', startTime: '10:00:00', endTime: '12:00:00' },
                        { name: 'Chokhi Dhani Rajasthani Village & Feast', date: '2026-09-12', startTime: '18:30:00', endTime: '22:30:00' },
                    ],
                },
                {
                    cityName: 'Udaipur',
                    startDate: '2026-09-14',
                    endDate: '2026-09-17',
                    sequenceOrder: 2,
                    activities: [
                        { name: 'Lake Pichola Sunset Boat Cruise to Jagmandir Island', date: '2026-09-15', startTime: '17:00:00', endTime: '18:30:00' },
                        { name: 'City Palace Museum & Crystal Gallery Tour', date: '2026-09-16', startTime: '10:30:00', endTime: '13:00:00' },
                    ],
                },
            ],
            costs: [
                { category: 'transport', description: 'Vande Bharat Express Train (Executive Class)', amount: '6400.00', costDate: '2026-09-10' },
                { category: 'stay', description: 'ITC Rajputana & Taj Fateh Prakash Heritage Suites', amount: '38500.00', costDate: '2026-09-10' },
                { category: 'activity', description: 'Royal Palace Entry Passes & Private Historian Guides', amount: '8900.00', costDate: '2026-09-11' },
                { category: 'meal', description: 'Fine Dining Dinners at 1135 AD & Chokhi Dhani Feast', amount: '12800.00', costDate: '2026-09-12' },
            ],
        },
        {
            owner: priya || aryan,
            name: 'Goa Coastal Getaway & Scuba Retreat',
            description: 'Sun-drenched tropical escape featuring catamaran sailing, scuba diving at Grand Island, and Portuguese heritage trails.',
            startDate: '2026-08-18',
            endDate: '2026-08-25',
            budgetAmount: '54000.00',
            status: 'ongoing',
            visibility: 'public',
            publicSlug: 'goa-coastal-scuba-retreat',
            coverPhotoUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
            stops: [
                {
                    cityName: 'Goa',
                    startDate: '2026-08-18',
                    endDate: '2026-08-25',
                    sequenceOrder: 1,
                    activities: [
                        { name: 'Grand Island Scuba Diving & Snorkeling Experience', date: '2026-08-20', startTime: '07:30:00', endTime: '13:30:00' },
                        { name: 'Sunset Sailing & Yacht Cruise on Mandovi River', date: '2026-08-22', startTime: '17:30:00', endTime: '19:30:00' },
                        { name: 'Dudhsagar Waterfalls & Spice Plantation Safari', date: '2026-08-23', startTime: '08:00:00', endTime: '15:00:00' },
                    ],
                },
            ],
            costs: [
                { category: 'transport', description: 'Direct Flight BLR-GOI Roundtrip', amount: '9200.00', costDate: '2026-08-18' },
                { category: 'stay', description: 'Seaside Boutique Resort Candolim (7 Nights)', amount: '26000.00', costDate: '2026-08-18' },
                { category: 'activity', description: 'PADI Scuba Diving & Private Sunset Catamaran', amount: '8500.00', costDate: '2026-08-20' },
                { category: 'meal', description: 'Seafood Cafes & Thalassa Beachside Dinners', amount: '7800.00', costDate: '2026-08-21' },
            ],
        },
        {
            owner: ankur || itesh,
            name: 'Spiritual Varanasi & Golden Triangle',
            description: 'Deep cultural expedition across the spiritual capital of Varanasi, Agra’s Taj Mahal, and historic Old Delhi.',
            startDate: '2026-07-05',
            endDate: '2026-07-14',
            budgetAmount: '68000.00',
            status: 'completed',
            visibility: 'public',
            publicSlug: 'spiritual-varanasi-golden-triangle',
            coverPhotoUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
            stops: [
                {
                    cityName: 'Varanasi',
                    startDate: '2026-07-05',
                    endDate: '2026-07-08',
                    sequenceOrder: 1,
                    activities: [
                        { name: 'Dashashwamedh Ghat Grand Ganga Aarti by Boat', date: '2026-07-06', startTime: '18:00:00', endTime: '20:00:00' },
                        { name: 'Sunrise Rowing Boat Tour & Ancient Alleys Walk', date: '2026-07-07', startTime: '05:30:00', endTime: '08:00:00' },
                    ],
                },
                {
                    cityName: 'Agra',
                    startDate: '2026-07-09',
                    endDate: '2026-07-11',
                    sequenceOrder: 2,
                    activities: [
                        { name: 'Taj Mahal Sunrise VIP Guided Heritage Tour', date: '2026-07-10', startTime: '05:45:00', endTime: '08:15:00' },
                    ],
                },
                {
                    cityName: 'Delhi',
                    startDate: '2026-07-12',
                    endDate: '2026-07-14',
                    sequenceOrder: 3,
                    activities: [],
                },
            ],
            costs: [
                { category: 'transport', description: 'Varanasi-Agra-Delhi Express Trains & Taxis', amount: '8500.00', costDate: '2026-07-05' },
                { category: 'stay', description: 'BrijRama Palace & ITC Mughal Hotels', amount: '34000.00', costDate: '2026-07-05' },
                { category: 'activity', description: 'Private Wooden Boats & Monument Entrances', amount: '5400.00', costDate: '2026-07-06' },
                { category: 'meal', description: 'Traditional Kashi Cuisine & Karim’s Feast', amount: '9200.00', costDate: '2026-07-07' },
            ],
        },
        {
            owner: rohan || aryan,
            name: 'Japan Autumn Blossom & Kyoto Zen Trails',
            description: 'Tokyo modern metropolis and ancient Kyoto temples, bullet trains, traditional tea ceremonies, and bamboo forests.',
            startDate: '2026-10-15',
            endDate: '2026-10-26',
            budgetAmount: '240000.00',
            status: 'planned',
            visibility: 'public',
            publicSlug: 'japan-autumn-kyoto-zen-2026',
            coverPhotoUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
            stops: [
                {
                    cityName: 'Tokyo',
                    startDate: '2026-10-15',
                    endDate: '2026-10-20',
                    sequenceOrder: 1,
                    activities: [
                        { name: 'Shibuya Crossing & TeamLab Planets Digital Art Museum', date: '2026-10-17', startTime: '10:00:00', endTime: '13:30:00' },
                    ],
                },
                {
                    cityName: 'Kyoto',
                    startDate: '2026-10-21',
                    endDate: '2026-10-26',
                    sequenceOrder: 2,
                    activities: [
                        { name: 'Fushimi Inari 10,000 Torii Gates & Arashiyama Bamboo Grove', date: '2026-10-22', startTime: '08:30:00', endTime: '12:30:00' },
                    ],
                },
            ],
            costs: [
                { category: 'transport', description: 'Japan Rail Pass 7-Day & Shinkansen High-Speed Train', amount: '36000.00', costDate: '2026-10-15' },
                { category: 'stay', description: 'Shinjuku Hotel & Kyoto Traditional Ryokan with Onsen', amount: '128000.00', costDate: '2026-10-15' },
                { category: 'activity', description: 'TeamLab Tickets & Private Tea Master Ceremony', amount: '18500.00', costDate: '2026-10-17' },
                { category: 'meal', description: '7-Course Kaiseki Dinners & Tsukiji Market Street Food', amount: '42000.00', costDate: '2026-10-18' },
            ],
        },
        {
            owner: neha || aman,
            name: 'Classic European Romance: Paris & Rome',
            description: 'Iconic museums, historical monuments, Parisian cafe culture, and ancient Roman history.',
            startDate: '2026-11-01',
            endDate: '2026-11-10',
            budgetAmount: '195000.00',
            status: 'draft',
            visibility: 'private',
            publicSlug: null,
            coverPhotoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
            stops: [
                {
                    cityName: 'Paris',
                    startDate: '2026-11-01',
                    endDate: '2026-11-05',
                    sequenceOrder: 1,
                    activities: [
                        { name: 'Eiffel Tower Summit Access & Seine River Cruise', date: '2026-11-03', startTime: '14:00:00', endTime: '17:30:00' },
                    ],
                },
                {
                    cityName: 'Rome',
                    startDate: '2026-11-06',
                    endDate: '2026-11-10',
                    sequenceOrder: 2,
                    activities: [
                        { name: 'Colosseum Arena Floor & Roman Forum VIP Tour', date: '2026-11-08', startTime: '09:30:00', endTime: '12:30:00' },
                    ],
                },
            ],
            costs: [
                { category: 'transport', description: 'Air France Inter-City Flight & Express Airport Transfers', amount: '24000.00', costDate: '2026-11-01' },
                { category: 'stay', description: 'Montmartre Boutique Hotel & Spanish Steps Suites', amount: '95000.00', costDate: '2026-11-01' },
                { category: 'activity', description: 'Louvre VIP Pass, Colosseum Arena & Seine River Tickets', amount: '22000.00', costDate: '2026-11-03' },
                { category: 'meal', description: 'Trastevere Pasta Dining & French Bistro Feasts', amount: '31000.00', costDate: '2026-11-04' },
            ],
        },
    ];

    for (const t of TRIPS_DATA) {
        if (!t.owner) continue;

        // Check if trip already exists
        const existingTrip = await db
            .select()
            .from(trips)
            .where(sql`LOWER(${trips.name}) = LOWER(${t.name}) AND ${trips.ownerId} = ${t.owner.id}`)
            .limit(1);

        let currentTrip;
        if (existingTrip.length > 0) {
            currentTrip = existingTrip[0];
            await db
                .update(trips)
                .set({
                    description: t.description,
                    startDate: t.startDate,
                    endDate: t.endDate,
                    budgetAmount: t.budgetAmount,
                    status: t.status,
                    visibility: t.visibility,
                    publicSlug: t.publicSlug,
                    coverPhotoUrl: t.coverPhotoUrl,
                })
                .where(eq(trips.id, currentTrip.id));
        } else {
            const [created] = await db
                .insert(trips)
                .values({
                    ownerId: t.owner.id,
                    name: t.name,
                    description: t.description,
                    startDate: t.startDate,
                    endDate: t.endDate,
                    budgetAmount: t.budgetAmount,
                    budgetCurrency: 'INR',
                    status: t.status,
                    visibility: t.visibility,
                    publicSlug: t.publicSlug,
                    coverPhotoUrl: t.coverPhotoUrl,
                })
                .returning();
            currentTrip = created;
        }

        // Clean & Re-seed stops and cost items for this trip
        await db.delete(tripCostItems).where(eq(tripCostItems.tripId, currentTrip.id));
        await db.delete(tripStops).where(eq(tripStops.tripId, currentTrip.id));

        // Insert Stops & Activities
        for (const s of t.stops) {
            const targetCity = cityMap.get(s.cityName);
            if (!targetCity) continue;

            const [stop] = await db
                .insert(tripStops)
                .values({
                    tripId: currentTrip.id,
                    cityId: targetCity.id,
                    startDate: s.startDate,
                    endDate: s.endDate,
                    sequenceOrder: s.sequenceOrder,
                })
                .returning();

            for (const act of s.activities) {
                const targetActivity = activityMap.get(act.name);
                if (!targetActivity) continue;

                await db
                    .insert(tripStopActivities)
                    .values({
                        tripStopId: stop.id,
                        activityId: targetActivity.id,
                        activityDate: act.date,
                        startTime: act.startTime,
                        endTime: act.endTime,
                        sequenceOrder: 1,
                        notes: 'Confirmed booking reservation.',
                    });
            }
        }

        // Insert Cost Items
        for (const cost of t.costs) {
            await db
                .insert(tripCostItems)
                .values({
                    tripId: currentTrip.id,
                    category: cost.category,
                    description: cost.description,
                    amount: cost.amount,
                    currency: 'INR',
                    costDate: cost.costDate,
                });
        }
    }
    console.log('✅ Realistic itineraries, multi-city stops, and expense ledgers populated.');

    // 6. Seed Saved Destinations / Bookmarks
    console.log('🔖 Seeding saved destination bookmarks...');
    const allUsers = Array.from(userMap.values());
    const allCities = Array.from(cityMap.values());

    for (const u of allUsers) {
        // Bookmark 3-4 random cities for each user
        const toBookmark = allCities.slice(0, 4);
        for (const c of toBookmark) {
            const existing = await db
                .select()
                .from(savedDestinations)
                .where(and(eq(savedDestinations.userId, u.id), eq(savedDestinations.cityId, c.id)))
                .limit(1);

            if (existing.length === 0) {
                await db.insert(savedDestinations).values({
                    userId: u.id,
                    cityId: c.id,
                });
            }
        }
    }
    console.log('✅ User bookmarks and saved destinations recorded.');

    console.log('🎉 Realistic dataset seeding complete!');
}

if (process.argv[1]?.endsWith('seed_realistic_data.js')) {
    seedRealisticData()
        .then(() => pool.end())
        .catch((err) => {
            console.error('Seeding error:', err);
            pool.end();
        });
}
