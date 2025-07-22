import { Client } from '../client/Client';
import { API_BASE_URL } from './Endpoints';

/**
 * Manages HTTP requests to the Discord API.
 */
export class RestManager {
    private client: Client;
    private readonly apiBaseUrl = API_BASE_URL;

    /**
     * Creates a new RestManager instance.
     * @param {Client} client The client instance.
     */
    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Makes an HTTP request to the Discord API.
     * @param {string} method The HTTP method (GET, POST, PUT, DELETE, PATCH).
     * @param {string} path The API endpoint path (e.g., '/applications/@me/commands').
     * @param {any} [body] The request body.
     * @returns {Promise<any>} The JSON response from the API.
     * @throws {Error} If the request fails or returns an error.
     */
    public async request(method: string, path: string, body?: any, customHeaders?: HeadersInit): Promise<any> {
        if (!this.client.token) {
            throw new Error('No token provided for REST request.');
        }

        const headers: HeadersInit = {
            'Authorization': `Bot ${this.client.token}`,
            'Content-Type': 'application/json',
            ...customHeaders,
        };

        const options: RequestInit = {
            method: method,
            headers: headers,
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const url = `${this.apiBaseUrl}${path}`;

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
            throw new Error(`API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return null;
        }

        return response.json();
    }
}
