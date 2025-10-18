import { toolRegistry, DataAnalysisTool, WebScrapingTool, EmailTool } from '@/lib/tools/toolsService'

describe('Tools Service', () => {
  describe('Tool Registry', () => {
    it('should register and retrieve tools', () => {
      const tools = toolRegistry.getAllTools()
      expect(tools.length).toBeGreaterThan(0)
      
      const dataAnalysisTool = toolRegistry.getTool('data_analysis')
      expect(dataAnalysisTool).toBeDefined()
      expect(dataAnalysisTool?.name).toBe('data_analysis')
    })

    it('should get tools by category', () => {
      const analysisTools = toolRegistry.getToolsByCategory('analysis')
      expect(analysisTools.length).toBeGreaterThan(0)
      expect(analysisTools.every(tool => tool.category === 'analysis')).toBe(true)
    })
  })

  describe('Data Analysis Tool', () => {
    let tool: DataAnalysisTool

    beforeEach(() => {
      tool = new DataAnalysisTool()
    })

    it('should validate input correctly', () => {
      expect(tool.validateInput({ data: [] })).toBe(true)
      expect(tool.validateInput({ data: [{ name: 'test' }] })).toBe(true)
      expect(tool.validateInput({})).toBe(false)
      expect(tool.validateInput(null)).toBe(false)
    })

    it('should execute successfully with valid input', async () => {
      const input = { data: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }] }
      const result = await tool.execute(input)
      
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data.summary).toBeDefined()
      expect(result.data.insights).toBeDefined()
      expect(result.data.recommendations).toBeDefined()
    })

    it('should handle errors gracefully', async () => {
      const input = { data: null }
      const result = await tool.execute(input)
      
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should return correct schema', () => {
      const schema = tool.getSchema()
      expect(schema.type).toBe('object')
      expect(schema.properties).toBeDefined()
      expect(schema.required).toContain('data')
    })
  })

  describe('Web Scraping Tool', () => {
    let tool: WebScrapingTool

    beforeEach(() => {
      tool = new WebScrapingTool()
    })

    it('should validate URL input', () => {
      expect(tool.validateInput({ url: 'https://example.com' })).toBe(true)
      expect(tool.validateInput({ url: 'http://test.com' })).toBe(true)
      expect(tool.validateInput({ url: 'invalid-url' })).toBe(false)
      expect(tool.validateInput({})).toBe(false)
    })

    it('should execute scraping simulation', async () => {
      const input = { url: 'https://example.com', selectors: { title: 'h1' } }
      const result = await tool.execute(input)
      
      expect(result.success).toBe(true)
      expect(result.data.url).toBe('https://example.com')
      expect(result.data.data).toBeDefined()
      expect(result.data.metadata).toBeDefined()
    })
  })

  describe('Email Tool', () => {
    let tool: EmailTool

    beforeEach(() => {
      tool = new EmailTool()
    })

    it('should validate email input', () => {
      const validInput = {
        to: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test Body'
      }
      expect(tool.validateInput(validInput)).toBe(true)

      const invalidInput = {
        to: 'invalid-email',
        subject: 'Test Subject',
        body: 'Test Body'
      }
      expect(tool.validateInput(invalidInput)).toBe(false)
    })

    it('should execute email simulation', async () => {
      const input = {
        to: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test Body',
        type: 'send'
      }
      const result = await tool.execute(input)
      
      expect(result.success).toBe(true)
      expect(result.data.to).toBe('test@example.com')
      expect(result.data.subject).toBe('Test Subject')
      expect(result.data.status).toBe('sent')
    })
  })

  describe('Tool Execution', () => {
    it('should execute tool through registry', async () => {
      const input = { data: [{ test: 'value' }] }
      const result = await toolRegistry.executeTool('data_analysis', input)
      
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should handle non-existent tool', async () => {
      const input = { test: 'value' }
      const result = await toolRegistry.executeTool('non_existent_tool', input)
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should handle invalid input', async () => {
      const input = { invalid: 'input' }
      const result = await toolRegistry.executeTool('data_analysis', input)
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid input')
    })
  })
})
