import { QueryFunctionContext, QueryKey } from 'react-query'
import clone from 'lodash/clone'
import { TQuery, TTotalResponse } from '@/types/api-types'
import { getInfLimit, getInfNextPage, getInfPage
  , getInfQuery, getInfTotalPages, throwErrorCalled } from '../extras/helpers-hrq'

export default class InfQueryBuilder<D = any, T extends TTotalResponse = TTotalResponse<D>> {

  private page: number
  private limit: number
  private infQueryParams: Record<string, string | number>
  private infResponse: T | undefined
  private nextPage: number | null

  constructor() {
    this.page = 0
    this.limit = 0
    this.infQueryParams = {}
    this.nextPage = -1
  }

  setInfPage(params: QueryFunctionContext<QueryKey, number>) {
    this.page = getInfPage(params)
    return this
  }

  setInfLimit() {
    this.limit = getInfLimit()
    return this
  }

  setInfQueryParams(query: TQuery) {
    if (this.page === 0) throwErrorCalled('setInfPage')
    if (this.limit === 0) throwErrorCalled('setInfLimit')

    this.infQueryParams = getInfQuery(query, this.page, this.limit)
    return this
  }

  getInfQueryParams() {
    if(Object.keys(this.infQueryParams).length === 0) throwErrorCalled('setInfQueryParams')
    return clone(this.infQueryParams)
  }

  setInfResponse(response: T) {
    this.infResponse = response
    return this 
  }
    
  setNextPage() {
    if (this.page === 0) throwErrorCalled('setInfPage')
    if (this.limit === 0) throwErrorCalled('setInfLimit')
    if (!this.infResponse) throwErrorCalled('setInfResponse')

    this.nextPage = getInfNextPage(this.page, 
      getInfTotalPages(this.infResponse!.total, this.limit))
    return this
  }
    
  getReturn() {
    if (!this.infResponse) throwErrorCalled('setInfResponse')
    if (this.nextPage === -1) throwErrorCalled('setNextPage')

    return {
      data: this.infResponse!.info,
      nextPage: this.nextPage
    }
  }
}
