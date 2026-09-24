import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const detailId = searchParams.get('detailId');
    const assignId = searchParams.get('assignId') || '';
    const cookies = searchParams.get('cookies') || '';

    if (!detailId && !assignId) {
      return NextResponse.json({ error: 'Detail ID or Assign ID required' }, { status: 400 });
    }

    const fetchImageRecord = async (bodyParam: string) => {
      try {
        const res = await fetch(
          'https://erp.coeruniversity.in/Web_Teaching/GetAssignmentImage',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Cookie: cookies,
            },
            body: bodyParam,
          }
        );

        if (!res.ok) return [];
        const json = await res.json();
        if (!json) return [];

        let records: Array<{ Assignment?: string; AssignmentExt?: string; SerialNo?: string }> = [];
        if (typeof json.data === 'string') {
          try {
            records = JSON.parse(json.data);
          } catch {
            records = [];
          }
        } else if (Array.isArray(json.data)) {
          records = json.data;
        } else if (json.Assignment) {
          records = [json];
        }
        return Array.isArray(records) ? records : [];
      } catch (e) {
        console.warn('[downloadRoute] Fetch attempt failed for param:', bodyParam, e);
        return [];
      }
    };

    // 1. Try with AssignmentDetailID
    let parsedRecords: Array<{ Assignment?: string; AssignmentExt?: string; SerialNo?: string }> = [];
    if (detailId) {
      parsedRecords = await fetchImageRecord(`AssignmentDetailID=${encodeURIComponent(detailId)}`);
    }

    // 2. Fallback to AssignID if AssignmentDetailID returned empty
    if ((!parsedRecords || parsedRecords.length === 0 || !parsedRecords[0]?.Assignment) && (assignId || detailId)) {
      const idToTry = assignId || detailId || '';
      parsedRecords = await fetchImageRecord(`AssignID=${encodeURIComponent(idToTry)}`);
    }

    // 3. Fallback to both combined
    if ((!parsedRecords || parsedRecords.length === 0 || !parsedRecords[0]?.Assignment) && detailId) {
      parsedRecords = await fetchImageRecord(
        `AssignmentDetailID=${encodeURIComponent(detailId)}&AssignID=${encodeURIComponent(assignId || detailId || '')}`
      );
    }

    if (parsedRecords && parsedRecords.length > 0 && typeof parsedRecords[0]?.Assignment === 'string') {
      const record = parsedRecords[0];
      const base64Str = record.Assignment as string;
      const fileBuffer = Buffer.from(base64Str, 'base64');
      const uint8 = new Uint8Array(fileBuffer);
      const ext = (record.AssignmentExt || '.pdf').replace(/^\./, '').trim() || 'pdf';
      const cleanSerial = (record.SerialNo || '').replace(/[\\/*?:"<>|]/g, '_').trim();
      const filename = `${cleanSerial || `Document_${detailId || assignId}`}.${ext}`;

      const mime =
        ext.toLowerCase() === 'pdf'
          ? 'application/pdf'
          : ext.toLowerCase() === 'docx'
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : ext.toLowerCase() === 'doc'
          ? 'application/msword'
          : 'application/octet-stream';

      return new NextResponse(uint8, {
        headers: {
          'Content-Type': mime,
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json(
      { error: 'File content not found on university portal. Please verify portal connectivity.' },
      { status: 404 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

