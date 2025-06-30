import axios from 'axios'; import {describe, expect, jest, test} from '@jest/globals';
const { normalize, EContactMethod, UserRecord  } = require('./normalizer.ts');


describe('normalize', () => {

    test('should throw an error if the axios response data is null', ()  => {
        axios.get = jest.fn(() => Promise.resolve({ data: null }));
        expect(normalize()).rejects.toThrow('response data is null/undefined');
    });

    test('should correctly normalize a user record with all expected fields (happy path)', () => {
        const mockLegacyData = {
            userId: '1007',
            fullName: 'John Doe',
            emailAddress: 'john.doe@example.com',
            accountStatus: 'Active',
            joinedDate: '2023-01-15', // YYYY-MM-DD format
            contact: {
                phoneNumber: '+1-123-456-7890',
                preferred: 'phone',
            },
            roles: ['admin', 'editor'],
        };

        axios.get = jest.fn(() => Promise.resolve({ data: mockLegacyData }));
        const result  = normalize();

        expect(result).toEqual({
            id: '1007',
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            isActive: true,
            createdAt: new Date('2023-01-15T00:00:00.000Z').toISOString(),
            primaryPhone: '+1-123-456-7890',
            roles: ['admin', 'editor'],
            preferredContactMethod: EContactMethod.phone
        });

    });

});
