// Debug test for API calls to compare with working curl request
import { senatorsService } from '../services/senatorsService';
import { api } from '../services/api';
import type { Senator } from '../types/senator';

export const debugApiCall = async () => {
  console.log('=== API Debug Test ===');
  console.log('API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('Full URL will be:', `${import.meta.env.VITE_API_BASE_URL}api/senators/`);
  
  try {
    // Test 1: Direct fetch call (similar to curl)
    console.log('\n--- Test 1: Direct fetch ---');
    const directResponse = await fetch('http://localhost:5050/api/senators/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Direct fetch status:', directResponse.status);
    console.log('Direct fetch headers:', Object.fromEntries(directResponse.headers));
    
    if (directResponse.ok) {
      const directData = await directResponse.json();
      console.log('Direct fetch data length:', directData.length);
      console.log('Direct fetch first item:', directData[0]);
    } else {
      const errorText = await directResponse.text();
      console.log('Direct fetch error:', errorText);
    }
    
  } catch (error) {
    console.error('Direct fetch error:', error);
  }

  try {
    // Test 2: Using our api service
    console.log('\n--- Test 2: Using api service ---');
    const serviceData: Senator[]  = await api.get('/api/senators/');
    console.log('Service data length:', serviceData.length);
    console.log('Service first item:', serviceData[0]);
    
  } catch (error) {
    console.error('Service error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error name:', error.name);
    }
  }

  try {
    // Test 3: Using senatorsService
    console.log('\n--- Test 3: Using senatorsService ---');
    const senatorsData = await senatorsService.getAllSenators();
    console.log('Senators service data length:', senatorsData.length);
    console.log('Senators service first item:', senatorsData[0]);
    
  } catch (error) {
    console.error('Senators service error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error name:', error.name);
    }
  }
};

// Test network connectivity and CORS
export const testNetworkAndCors = async () => {
  console.log('\n=== Network & CORS Test ===');
  
  try {
    // Test basic connectivity
    const response = await fetch('http://localhost:5050/api/senators/', {
      method: 'OPTIONS',
    });
    
    console.log('OPTIONS request status:', response.status);
    console.log('CORS headers:');
    console.log('  Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    console.log('  Access-Control-Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'));
    console.log('  Access-Control-Allow-Headers:', response.headers.get('Access-Control-Allow-Headers'));
    
  } catch (error) {
    console.error('Network/CORS test error:', error);
  }
};