import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  buildUrl(url: string, subPaths?: string[], queryParams?: { [key: string]: string }) {
    let fullUrl = url;

    if (subPaths && subPaths.length > 0) {
      if (!fullUrl.endsWith('/')) {
        fullUrl += '/';
      }

      fullUrl += subPaths.join('/');
    }

    const urlObject = new URL(fullUrl);

    if (queryParams) {
      for (const param in queryParams) {
        urlObject.searchParams.append(param, queryParams[param]);
      }
    }

    return urlObject.toString();
  }
}
