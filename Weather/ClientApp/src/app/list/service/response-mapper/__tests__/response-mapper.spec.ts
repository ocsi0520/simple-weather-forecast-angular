import { ListViewQueryDescriptor } from '../../../descriptors/list-view-query-descriptor';
import { RawResponse } from '../../raw-response';
import { WeatherResponse } from '../../weather-response';
import { WeatherResponseMapper } from '../response-mapper';

const createDummyRawResponse = (numberOfRecords: number): RawResponse => {
  return Array.from({ length: numberOfRecords }).fill(null).map(_ => ({
    date: '2020-01-01',
    summary: 'Cold',
    temperatureC: -10,
    temperatureF: 14
  }));
};

describe('ResponseMapper', () => {
  let unitUnderTest: WeatherResponseMapper;
  beforeEach(() => {
    unitUnderTest = new WeatherResponseMapper();
  });

  describe('no pagination', () => {
    let listViewQueryDescriptor: ListViewQueryDescriptor;
    beforeEach(() => listViewQueryDescriptor = { pagination: null });
    it('should return an empty response', () => {
      const rawResponse = createDummyRawResponse(0);
      const mappedResponse = unitUnderTest.mapRawResponse(listViewQueryDescriptor, rawResponse);
      const expectedResponse: WeatherResponse = { weatherData: [], listViewDescriptor: { pagination: null } };
      expect(mappedResponse).toEqual(expectedResponse);
    });
    it('should return response with 100 records, no pagination', () => {
      const rawResponse = createDummyRawResponse(100);
      const mappedResponse = unitUnderTest.mapRawResponse(listViewQueryDescriptor, rawResponse);
      const expectedResponse: WeatherResponse = {
        weatherData: rawResponse, listViewDescriptor: { pagination: null }
      };
      expect(mappedResponse).toEqual(expectedResponse);
    });
  });
  describe('pagination', () => {
    let listViewQueryDescriptor: ListViewQueryDescriptor;
    beforeEach(() =>
      listViewQueryDescriptor = {
        pagination: { currentIndex: 0, size: 50 }
      });

    describe('no result', () => {
      it('should return empty record-list with 0 available pages', () => {
        const rawResponse = createDummyRawResponse(0);
        const mappedResponse = unitUnderTest.mapRawResponse(listViewQueryDescriptor, rawResponse);
        const expectedResponse: WeatherResponse = {
          weatherData: [], listViewDescriptor: { pagination: { currentIndex: 0, size: 50, availablePages: 0 } }
        };
        expect(mappedResponse).toEqual(expectedResponse);
      });
    });
    describe('length is less than pagination size', () => {
      it('should return record-list with 1 available page', () => {
        const rawResponse = createDummyRawResponse(49);
        const mappedResponse = unitUnderTest.mapRawResponse(listViewQueryDescriptor, rawResponse);
        const expectedResponse: WeatherResponse = {
          weatherData: rawResponse, listViewDescriptor: { pagination: { currentIndex: 0, size: 50, availablePages: 1 } }
        };
        expect(mappedResponse).toEqual(expectedResponse);
      });
      it('should return with an over-paginated descriptor', () => {
        listViewQueryDescriptor = { pagination: { ...listViewQueryDescriptor.pagination, currentIndex: 1 } };
        const rawResponse = createDummyRawResponse(49);
        const mappedResponse = unitUnderTest.mapRawResponse(listViewQueryDescriptor, rawResponse);
        const expectedResponse: WeatherResponse = {
          weatherData: [], listViewDescriptor: { pagination: { currentIndex: 1, size: 50, availablePages: 1 } }
        };
        expect(mappedResponse).toEqual(expectedResponse);
      });
    });
    describe('length equals to pagination size', () => {
      it('should return record-list with 1 available page', () => {
        const rawResponse = createDummyRawResponse(listViewQueryDescriptor.pagination.size);
        const mappedResponse = unitUnderTest.mapRawResponse(listViewQueryDescriptor, rawResponse);
        const expectedResponse: WeatherResponse = {
          weatherData: rawResponse,
          listViewDescriptor: { pagination: { currentIndex: 0, size: 50, availablePages: 1 } }
        };
        expect(mappedResponse).toEqual(expectedResponse);
      });
    });
    describe('length is more than pagination size', () => {
      let rawResponse: RawResponse;
      beforeEach(() => rawResponse = createDummyRawResponse(120));
      it('should show the first page', () => {
        const mappedResponse = unitUnderTest.mapRawResponse(listViewQueryDescriptor, rawResponse);
        const expectedResponse: WeatherResponse = {
          weatherData: rawResponse.slice(0, 50),
          listViewDescriptor: { pagination: { currentIndex: 0, size: 50, availablePages: 3 } }
        };
        expect(mappedResponse).toEqual(expectedResponse);
      });
      it('should show the second full page', () => {
        listViewQueryDescriptor = { pagination: { ...listViewQueryDescriptor.pagination, currentIndex: 1 } };
        const mappedResponse = unitUnderTest.mapRawResponse(listViewQueryDescriptor, rawResponse);
        const expectedResponse: WeatherResponse = {
          weatherData: rawResponse.slice(50, 100),
          listViewDescriptor: { pagination: { currentIndex: 1, size: 50, availablePages: 3 } }
        };
        expect(mappedResponse).toEqual(expectedResponse);
      });
      it('should show the last non-full-sized page', () => {
        listViewQueryDescriptor = { pagination: { ...listViewQueryDescriptor.pagination, currentIndex: 2 } };
        const mappedResponse = unitUnderTest.mapRawResponse(listViewQueryDescriptor, rawResponse);
        const expectedResponse: WeatherResponse = {
          weatherData: rawResponse.slice(100),
          listViewDescriptor: { pagination: { currentIndex: 2, size: 50, availablePages: 3 } }
        };
        expect(mappedResponse).toEqual(expectedResponse);
      });
    });
  });
});