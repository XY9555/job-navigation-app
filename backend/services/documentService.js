// Word文档生成服务
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = require('docx');
const fs = require('fs');
const path = require('path');

class DocumentService {
  // 生成简历评测结果Word文档
  static async generateEvaluationReport(evaluationData, sourceInfo = {}) {
    try {
      console.log('📄 开始生成评测结果Word文档...');
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // 标题
            new Paragraph({
              children: [
                new TextRun({
                  text: "简历评测报告",
                  bold: true,
                  size: 32,
                  color: "2E74B5"
                })
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            
            // 基本信息
            new Paragraph({
              children: [
                new TextRun({
                  text: "评测信息",
                  bold: true,
                  size: 24,
                  color: "1F4E79"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "评测时间：", bold: true }),
                new TextRun({ text: new Date().toLocaleString('zh-CN') })
              ],
              spacing: { after: 100 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "评测方式：", bold: true }),
                new TextRun({ text: sourceInfo.type === 'select' ? '选择已有简历' : sourceInfo.type === 'upload' ? '上传文件评测' : '未知' })
              ],
              spacing: { after: 100 }
            }),
            
            ...(sourceInfo.fileName ? [
              new Paragraph({
                children: [
                  new TextRun({ text: "文件名称：", bold: true }),
                  new TextRun({ text: sourceInfo.fileName })
                ],
                spacing: { after: 200 }
              })
            ] : []),
            
            // 评测分数
            new Paragraph({
              children: [
                new TextRun({
                  text: "评测结果",
                  bold: true,
                  size: 24,
                  color: "1F4E79"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: `综合评分：${evaluationData.score || 0} 分`,
                  bold: true,
                  size: 20,
                  color: evaluationData.score >= 80 ? "70AD47" : evaluationData.score >= 60 ? "FFC000" : "C5504B"
                })
              ],
              spacing: { after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: this.getMatchingDescription(analysisData.matchingScore),
                  italic: true,
                  color: "595959"
                })
              ],
              spacing: { after: 300 }
            }),
            
            // 评分理由详情
            ...(analysisData.reasons && analysisData.reasons.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "📋 评分理由",
                    bold: true,
                    size: 18,
                    color: "5B2C6F"
                  })
                ],
                spacing: { before: 200, after: 150 }
              }),
              ...analysisData.reasons.map(reason => {
                const typeColor = reason.type === 'positive' ? "70AD47" : 
                                 reason.type === 'negative' ? "C5504B" : "FFC000";
                const typeSymbol = reason.type === 'positive' ? "✓" : 
                                  reason.type === 'negative' ? "✗" : "◆";
                
                return [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `${typeSymbol} `, color: typeColor, bold: true, size: 16 }),
                      new TextRun({ text: reason.title, bold: true }),
                      new TextRun({ text: ` (${reason.score > 0 ? '+' : ''}${reason.score}分)`, color: typeColor })
                    ],
                    spacing: { after: 50 }
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: `   ${reason.description}`, color: "595959" })
                    ],
                    spacing: { after: 150 }
                  })
                ];
              }).flat()
            ] : []),
            
            // 优势分析
            ...(evaluationData.strengths && evaluationData.strengths.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "✅ 简历优势",
                    bold: true,
                    size: 18,
                    color: "70AD47"
                  })
                ],
                spacing: { before: 200, after: 150 }
              }),
              ...evaluationData.strengths.map(strength => 
                new Paragraph({
                  children: [
                    new TextRun({ text: "• ", color: "70AD47", bold: true }),
                    new TextRun({ text: strength })
                  ],
                  spacing: { after: 100 }
                })
              )
            ] : []),
            
            // 不足之处
            ...(evaluationData.weaknesses && evaluationData.weaknesses.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "⚠️ 需要改进",
                    bold: true,
                    size: 18,
                    color: "FFC000"
                  })
                ],
                spacing: { before: 300, after: 150 }
              }),
              ...evaluationData.weaknesses.map(weakness => 
                new Paragraph({
                  children: [
                    new TextRun({ text: "• ", color: "FFC000", bold: true }),
                    new TextRun({ text: weakness })
                  ],
                  spacing: { after: 100 }
                })
              )
            ] : []),
            
            // 优化建议
            ...(evaluationData.suggestions && evaluationData.suggestions.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "💡 优化建议",
                    bold: true,
                    size: 18,
                    color: "2E74B5"
                  })
                ],
                spacing: { before: 300, after: 150 }
              }),
              ...evaluationData.suggestions.map((suggestion, index) => 
                new Paragraph({
                  children: [
                    new TextRun({ text: `${index + 1}. `, bold: true, color: "2E74B5" }),
                    new TextRun({ text: suggestion })
                  ],
                  spacing: { after: 100 }
                })
              )
            ] : []),
            
            // 详细评分
            ...(evaluationData.details ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "详细评分",
                    bold: true,
                    size: 18,
                    color: "1F4E79"
                  })
                ],
                spacing: { before: 400, after: 150 }
              }),
              ...Object.entries(evaluationData.details).map(([key, score]) => 
                new Paragraph({
                  children: [
                    new TextRun({ text: `${this.getDetailName(key)}：`, bold: true }),
                    new TextRun({ 
                      text: `${score} 分`,
                      color: score >= 80 ? "70AD47" : score >= 60 ? "FFC000" : "C5504B"
                    })
                  ],
                  spacing: { after: 100 }
                })
              )
            ] : []),
            
            // 页脚
            new Paragraph({
              children: [
                new TextRun({
                  text: "本报告由求职导航AI系统自动生成",
                  italic: true,
                  size: 16,
                  color: "808080"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 600 }
            })
          ]
        }]
      });
      
      console.log('✅ Word文档结构生成完成');
      return doc;
      
    } catch (error) {
      console.error('❌ 生成评测报告失败:', error);
      throw error;
    }
  }
  
  // 生成职位匹配分析Word文档
  static async generateMatchingReport(analysisData, sourceInfo = {}) {
    try {
      console.log('📄 开始生成匹配分析Word文档...');
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // 标题
            new Paragraph({
              children: [
                new TextRun({
                  text: "职位匹配分析报告",
                  bold: true,
                  size: 32,
                  color: "7030A0"
                })
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            
            // 基本信息
            new Paragraph({
              children: [
                new TextRun({
                  text: "分析信息",
                  bold: true,
                  size: 24,
                  color: "5B2C6F"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "分析时间：", bold: true }),
                new TextRun({ text: new Date().toLocaleString('zh-CN') })
              ],
              spacing: { after: 100 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "目标职位：", bold: true }),
                new TextRun({ text: analysisData.jobInfo?.title || '未指定' })
              ],
              spacing: { after: 100 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "分析方式：", bold: true }),
                new TextRun({ text: sourceInfo.type === 'select' ? '选择已有简历' : sourceInfo.type === 'upload' ? '上传文件分析' : '未知' })
              ],
              spacing: { after: 200 }
            }),
            
            // 匹配度结果
            new Paragraph({
              children: [
                new TextRun({
                  text: "匹配度分析",
                  bold: true,
                  size: 24,
                  color: "5B2C6F"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: `综合匹配度：${analysisData.matchingScore || 0}%`,
                  bold: true,
                  size: 20,
                  color: analysisData.matchingScore >= 80 ? "70AD47" : analysisData.matchingScore >= 60 ? "FFC000" : "C5504B"
                })
              ],
              spacing: { after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: this.getMatchingDescription(analysisData.matchingScore),
                  italic: true,
                  color: "595959"
                })
              ],
              spacing: { after: 300 }
            }),
            
            // 评分理由详情
            ...(analysisData.reasons && analysisData.reasons.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "📋 评分理由",
                    bold: true,
                    size: 18,
                    color: "5B2C6F"
                  })
                ],
                spacing: { before: 200, after: 150 }
              }),
              ...analysisData.reasons.map(reason => {
                const typeColor = reason.type === 'positive' ? "70AD47" : 
                                 reason.type === 'negative' ? "C5504B" : "FFC000";
                const typeSymbol = reason.type === 'positive' ? "✓" : 
                                  reason.type === 'negative' ? "✗" : "◆";
                
                return [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `${typeSymbol} `, color: typeColor, bold: true, size: 16 }),
                      new TextRun({ text: reason.title, bold: true }),
                      new TextRun({ text: ` (${reason.score > 0 ? '+' : ''}${reason.score}分)`, color: typeColor })
                    ],
                    spacing: { after: 50 }
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: `   ${reason.description}`, color: "595959" })
                    ],
                    spacing: { after: 150 }
                  })
                ];
              }).flat()
            ] : []),
            
            // 职位描述
            ...(analysisData.jobInfo?.description ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "职位要求",
                    bold: true,
                    size: 18,
                    color: "5B2C6F"
                  })
                ],
                spacing: { before: 200, after: 150 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: analysisData.jobInfo.description })
                ],
                spacing: { after: 300 }
              })
            ] : []),
            
            // 匹配优势
            ...(analysisData.strengths && analysisData.strengths.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "✅ 匹配优势",
                    bold: true,
                    size: 18,
                    color: "70AD47"
                  })
                ],
                spacing: { before: 200, after: 150 }
              }),
              ...analysisData.strengths.map(strength => 
                new Paragraph({
                  children: [
                    new TextRun({ text: "• ", color: "70AD47", bold: true }),
                    new TextRun({ text: strength })
                  ],
                  spacing: { after: 100 }
                })
              )
            ] : []),
            
            // 能力差距
            ...(analysisData.gaps && analysisData.gaps.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "⚠️ 能力差距",
                    bold: true,
                    size: 18,
                    color: "FFC000"
                  })
                ],
                spacing: { before: 300, after: 150 }
              }),
              ...analysisData.gaps.map(gap => 
                new Paragraph({
                  children: [
                    new TextRun({ text: "• ", color: "FFC000", bold: true }),
                    new TextRun({ text: gap })
                  ],
                  spacing: { after: 100 }
                })
              )
            ] : []),
            
            // 提升建议
            ...(analysisData.suggestions && analysisData.suggestions.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "💡 提升建议",
                    bold: true,
                    size: 18,
                    color: "2E74B5"
                  })
                ],
                spacing: { before: 300, after: 150 }
              }),
              ...analysisData.suggestions.map((suggestion, index) => {
                // 处理对象格式的建议
                const suggestionText = typeof suggestion === 'object' 
                  ? `【${this.getPriorityText(suggestion.priority)}】${suggestion.title}：${suggestion.description}`
                  : suggestion;
                
                return new Paragraph({
                  children: [
                    new TextRun({ text: `${index + 1}. `, bold: true, color: "2E74B5" }),
                    new TextRun({ text: suggestionText })
                  ],
                  spacing: { after: 100 }
                });
              })
            ] : []),
            
            // 关注方向
            ...(analysisData.focusAreas && analysisData.focusAreas.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "🎯 关注方向",
                    bold: true,
                    size: 18,
                    color: "5B2C6F"
                  })
                ],
                spacing: { before: 400, after: 150 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "建议重点关注：", bold: true }),
                  new TextRun({ text: analysisData.focusAreas.join('、') })
                ],
                spacing: { after: 200 }
              })
            ] : []),
            
            // 关键词匹配
            ...(analysisData.keywordMatches && analysisData.keywordMatches.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "🔍 关键词匹配",
                    bold: true,
                    size: 18,
                    color: "5B2C6F"
                  })
                ],
                spacing: { before: 200, after: 150 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "匹配的关键词：", bold: true }),
                  new TextRun({ text: analysisData.keywordMatches.join('、') })
                ],
                spacing: { after: 100 }
              })
            ] : []),
            
            // 页脚
            new Paragraph({
              children: [
                new TextRun({
                  text: "本报告由求职导航AI系统自动生成",
                  italic: true,
                  size: 16,
                  color: "808080"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 600 }
            })
          ]
        }]
      });
      
      console.log('✅ Word文档结构生成完成');
      return doc;
      
    } catch (error) {
      console.error('❌ 生成匹配分析报告失败:', error);
      throw error;
    }
  }
  
  // 保存文档到文件
  static async saveDocument(doc, filename) {
    try {
      // 确保下载目录存在
      const downloadDir = path.join(__dirname, '../downloads');
      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }
      
      const filePath = path.join(downloadDir, filename);
      const buffer = await Packer.toBuffer(doc);
      
      fs.writeFileSync(filePath, buffer);
      console.log('✅ 文档保存成功:', filePath);
      
      return filePath;
    } catch (error) {
      console.error('❌ 保存文档失败:', error);
      throw error;
    }
  }
  
  // 获取评分描述
  static getScoreDescription(score) {
    if (score >= 90) return '您的简历质量优秀，各方面表现出色！';
    if (score >= 80) return '您的简历质量良好，整体表现不错，还有进一步提升的空间。';
    if (score >= 70) return '您的简历基本合格，建议在某些方面进行优化完善。';
    if (score >= 60) return '您的简历需要较大改进，建议重点关注内容完整性和表达方式。';
    return '您的简历需要全面优化，建议从结构、内容、格式等多方面进行改进。';
  }
  
  // 获取匹配度描述
  static getMatchingDescription(score) {
    if (score >= 90) return '您与该职位高度匹配，建议积极投递简历！';
    if (score >= 80) return '您与该职位匹配度良好，具备较强的竞争力。';
    if (score >= 70) return '您与该职位基本匹配，建议针对性地提升相关技能。';
    if (score >= 60) return '您与该职位存在一定差距，需要重点提升核心能力。';
    return '您与该职位匹配度较低，建议考虑其他更适合的职位或进行系统性学习。';
  }
  
  // 获取详细评分项目名称
  static getDetailName(key) {
    const nameMap = {
      content: '内容完整性',
      format: '格式规范性',
      experience: '经验描述',
      skills: '技能展示',
      keywords: '关键词匹配',
      projects: '项目经历'
    };
    return nameMap[key] || key;
  }
  
  // 获取优先级文本
  static getPriorityText(priority) {
    const priorityMap = {
      high: '高优先级',
      medium: '中优先级',
      low: '低优先级'
    };
    return priorityMap[priority] || '普通';
  }
}

module.exports = DocumentService;