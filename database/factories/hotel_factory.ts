import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'
import Hotel from '#models/hotel'
import { OrganizationFactory } from './organization_factory.js'

export const HotelFactory = factory
  .define(Hotel, async ({ faker }: FactoryContextContract) => {
    const hotelPrefixes = ['Grand', 'Royal', 'Plaza', 'Park', 'Beach', 'Mountain', 'City', 'Harbor']
    const hotelSuffixes = ['Hotel', 'Inn', 'Resort', 'Lodge', 'Suites', 'Palace']

    const prefix = faker.helpers.arrayElement(hotelPrefixes)
    const cityName = faker.location.city()
    const suffix = faker.helpers.arrayElement(hotelSuffixes)
    const hotelName = `${prefix} ${cityName} ${suffix}`

    const phoneNumber = faker.phone.number({ style: 'international' })

    return {
      organization_id: 0, // Will be set by relation
      name: hotelName,
      slug: faker.helpers.slugify(hotelName).toLowerCase(),
      description: faker.lorem.paragraph(3),
      phone: phoneNumber,
      email: faker.internet.email({
        firstName: faker.helpers.slugify(hotelName).toLowerCase(),
        provider: 'hotel.com',
      }),
      website: `https://www.${faker.helpers.slugify(hotelName).toLowerCase()}.com`,
      address: faker.location.streetAddress(),
      city: cityName,
      state: faker.location.state(),
      country: faker.location.country(),
      postal_code: faker.location.zipCode(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      timezone: faker.helpers.arrayElement(['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris']),
      currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'CAD']),
      check_in_time: faker.helpers.arrayElement(['14:00', '15:00', '16:00']),
      check_out_time: faker.helpers.arrayElement(['10:00', '11:00', '12:00']),
      total_rooms: faker.number.int({ min: 20, max: 500 }),
      star_rating: faker.number.int({ min: 3, max: 5 }),
      policies: {
        cancellation_policy: faker.helpers.arrayElement([
          '24 hours free cancellation',
          '48 hours free cancellation',
          '72 hours free cancellation',
          'Non-refundable',
          '7 days free cancellation',
        ]),
        pet_policy: faker.datatype.boolean({ probability: 0.3 }) ? 'Pets allowed' : 'No pets',
        smoking_policy: faker.datatype.boolean({ probability: 0.2 })
          ? 'Smoking rooms available'
          : 'Non-smoking property',
        child_policy: faker.datatype.boolean({ probability: 0.9 })
          ? 'Children welcome'
          : 'Adults only',
        payment_policy: faker.helpers.arrayElement([
          'Payment at check-in',
          'Prepayment required',
          'Deposit required',
        ]),
        overbooking_percentage: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
      },
      contact_info: {
        front_desk_phone: phoneNumber,
        reservation_phone: faker.phone.number({ style: 'international' }),
        emergency_phone: faker.phone.number({ style: 'national' }),
        manager_name: faker.person.fullName(),
        manager_email: faker.internet.email(),
      },
      is_active: true,
      is_deleted: false,
      metadata: {
        year_established: faker.date.past({ years: 50 }).getFullYear(),
        last_renovation: faker.date.recent({ days: 1000 }).getFullYear(),
        certifications: faker.helpers.arrayElements(
          ['ISO 9001', 'Green Key', 'EarthCheck', 'LEED', 'TripAdvisor Certificate'],
          { min: 0, max: 3 }
        ),
      },
    }
  })
  .relation('organization', () => OrganizationFactory)
  .state('active', (hotel) => {
    hotel.is_active = true
  })
  .state('seasonal', (hotel, { faker }) => {
    hotel.is_active = faker.date.future().getMonth() >= 5 && faker.date.future().getMonth() <= 9
    hotel.metadata.seasonal_operation = {
      open_month: 5,
      close_month: 9,
    }
  })
  .state('maintenance', (hotel) => {
    hotel.is_active = false
    hotel.metadata.maintenance_reason = 'Renovation in progress'
  })
  .state('fullBooked', (hotel, { faker }) => {
    hotel.metadata.occupancy_rate = faker.number.float({ min: 95, max: 100, fractionDigits: 1 })
  })
  .state('urban', (hotel, { faker }) => {
    hotel.name = `City Center ${faker.location.city()} Hotel`
    hotel.total_rooms = faker.number.int({ min: 100, max: 300 })
    hotel.metadata.amenities = [
      'wifi',
      'parking',
      'gym',
      'business_center',
      'conference_rooms',
      'restaurant',
      'bar',
    ]
    hotel.policies.pet_policy = 'No pets'
  })
  .state('beach', (hotel, { faker }) => {
    hotel.name = `${faker.location.city()} Beach Resort`
    hotel.metadata.amenities = [
      'wifi',
      'pool',
      'beach_access',
      'spa',
      'restaurant',
      'bar',
      'water_sports',
    ]
    hotel.metadata.minimum_stay_nights = faker.helpers.arrayElement([2, 3, 5])
  })
  .state('boutique', (hotel, { faker }) => {
    hotel.name = `The ${faker.company.catchPhraseAdjective()} ${faker.location.city()}`
    hotel.total_rooms = faker.number.int({ min: 10, max: 50 })
    hotel.metadata.rating = faker.number.float({ min: 4.5, max: 5.0, fractionDigits: 1 })
    hotel.description = 'An exclusive boutique hotel offering personalized luxury experiences.'
  })
  .state('cityHotel', (hotel, { faker }) => {
    hotel.name = `${faker.location.city()} City Hotel`
    hotel.total_rooms = faker.number.int({ min: 100, max: 300 })
    hotel.star_rating = faker.number.int({ min: 3, max: 4 })
    hotel.metadata.hotel_type = 'city'
    hotel.metadata.amenities = ['wifi', 'parking', 'gym', 'business_center', 'restaurant']
  })
  .state('beachResort', (hotel, { faker }) => {
    hotel.name = `${faker.location.city()} Beach Resort & Spa`
    hotel.total_rooms = faker.number.int({ min: 150, max: 400 })
    hotel.star_rating = faker.number.int({ min: 4, max: 5 })
    hotel.metadata.hotel_type = 'resort'
    hotel.metadata.amenities = ['wifi', 'pool', 'beach_access', 'spa', 'multiple_restaurants', 'kids_club']
  })
  .state('businessHotel', (hotel, { faker }) => {
    hotel.name = `${faker.location.city()} Business Hotel`
    hotel.total_rooms = faker.number.int({ min: 200, max: 500 })
    hotel.star_rating = 4
    hotel.metadata.hotel_type = 'business'
    hotel.metadata.amenities = ['wifi', 'parking', 'gym', 'business_center', 'conference_rooms', 'airport_shuttle']
  })
  .state('boutiqueHotel', (hotel, { faker }) => {
    hotel.name = `The ${faker.company.catchPhraseAdjective()} Boutique`
    hotel.total_rooms = faker.number.int({ min: 20, max: 60 })
    hotel.star_rating = faker.number.int({ min: 4, max: 5 })
    hotel.metadata.hotel_type = 'boutique'
    hotel.metadata.unique_features = ['curated_art', 'local_experiences', 'personalized_service']
  })
  .state('luxuryHotel', (hotel, { faker }) => {
    hotel.name = `${faker.location.city()} Grand Palace Hotel`
    hotel.total_rooms = faker.number.int({ min: 200, max: 600 })
    hotel.star_rating = 5
    hotel.metadata.hotel_type = 'luxury'
    hotel.metadata.amenities = ['wifi', 'valet_parking', 'spa', 'fine_dining', 'concierge', 'butler_service']
    hotel.policies.overbooking_percentage = 0
  })
  .after('create', async () => {
    // Update organization's hotel count if needed
    // Logger is not directly available in factory context
  })
  .build()
